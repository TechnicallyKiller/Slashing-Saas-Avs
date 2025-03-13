require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");

// Load env variables
const RPC = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const UTILS_ADDRESS = process.env.VALIDATOR_UTILS;

// Load ABI (with both params)
const ABI = [
    "function updateLastSeenBlock(address operator, uint256 blockNumber) external"
];

// Setup provider & signer
const provider = new ethers.JsonRpcProvider(RPC);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const utils = new ethers.Contract(UTILS_ADDRESS, ABI, wallet);

// Load operators list
const operators = JSON.parse(fs.readFileSync("bots/data/operators.json", "utf-8"));

// Function to report health
async function pingOperators() {
    const latestBlock = await provider.getBlockNumber();  // you can use this dynamically

    for (const op of operators) {
        try {
            const tx = await utils.updateLastSeenBlock(op.operatorAddress, latestBlock);
            await tx.wait();
            console.log(`✅ Reported health for ${op.operatorName} at block ${latestBlock}`);
        } catch (err) {
            console.error(`❌ Failed for ${op.operatorName}: ${err.message}`);
        }
    }
}

// Repeat every 1 minute
setInterval(pingOperators, 60 * 1000);
