# AVS Offchain Bots Suite - Python Scripts

import time
import requests
from web3 import Web3
from eth_account import Account
from dotenv import load_dotenv
import os

load_dotenv()

# Load ENV values
RPC_URL = os.getenv("RPC_URL")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
SLASHING_CONTRACT = os.getenv("SLASHING_CONTRACT")
HEALTH_REPORTER_CONTRACT = os.getenv("HEALTH_REPORTER_CONTRACT")

w3 = Web3(Web3.HTTPProvider(RPC_URL))
account = Account.from_key(PRIVATE_KEY)

# Load ABI files
with open("SlashingTriggerManager.json") as f:
    slashing_abi = f.read()
with open("NodeHealthReporter.json") as f:
    health_abi = f.read()

slashing_contract = w3.eth.contract(address=SLASHING_CONTRACT, abi=slashing_abi)
health_contract = w3.eth.contract(address=HEALTH_REPORTER_CONTRACT, abi=health_abi)

# --------------------------
# 1. Node Health Reporter Bot
# --------------------------
def report_block(operator_address):
    try:
        tx = health_contract.functions.updateLastSeenBlock(operator_address, w3.eth.block_number).build_transaction({
            'from': account.address,
            'nonce': w3.eth.get_transaction_count(account.address),
            'gas': 300000,
            'gasPrice': w3.to_wei('30', 'gwei')
        })
        signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        print(f"LastSeenBlock updated | Tx: {tx_hash.hex()}")
    except Exception as e:
        print(f"Error: {e}")

# --------------------------
# 2. Data Mismatch Detector Bot
# --------------------------
def detect_data_mismatch(operator_address, expected_hash):
    reported_hash = slashing_contract.functions.operatorReportedHash(operator_address).call()
    if reported_hash != expected_hash:
        trigger_data_mismatch(operator_address, expected_hash)


def trigger_data_mismatch(operator_address, expected_hash):
    try:
        tx = slashing_contract.functions.reportDataMismatch(operator_address, expected_hash).build_transaction({
            'from': account.address,
            'nonce': w3.eth.get_transaction_count(account.address),
            'gas': 300000,
            'gasPrice': w3.to_wei('30', 'gwei')
        })
        signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        print(f"DataMismatchViolation triggered | Tx: {tx_hash.hex()}")
    except Exception as e:
        print(f"Error: {e}")

# --------------------------
# 3. Double Signature Detector Bot
# --------------------------
signed_hash_db = {}  # Local in-memory cache or replace with persistent DB

def detect_double_sign(operator_address, new_hash):
    if operator_address not in signed_hash_db:
        signed_hash_db[operator_address] = set()
    
    if new_hash in signed_hash_db[operator_address]:
        trigger_double_sign(operator_address, new_hash)
    else:
        signed_hash_db[operator_address].add(new_hash)


def trigger_double_sign(operator_address, hash_):
    try:
        tx = slashing_contract.functions.reportDoubleSign(operator_address, hash_).build_transaction({
            'from': account.address,
            'nonce': w3.eth.get_transaction_count(account.address),
            'gas': 300000,
            'gasPrice': w3.to_wei('30', 'gwei')
        })
        signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        print(f"DoubleSignViolation triggered | Tx: {tx_hash.hex()}")
    except Exception as e:
        print(f"Error: {e}")

# --------------------------
# Scheduler Example
# --------------------------
if __name__ == '__main__':
    operator = "<OPERATOR_ADDRESS>"
    expected_hash = "<EXPECTED_HASH_FROM_OFFCHAIN>"
    new_hash = "<OPERATOR_REPORTED_HASH>"

    while True:
        report_block(operator)
        detect_data_mismatch(operator, expected_hash)
        detect_double_sign(operator, new_hash)
        time.sleep(30)
