require("dotenv").config();
const { ethers } = require("ethers");

const RPC = process.env.RPC_URL;
const ALLOCATION_MANAGER = process.env.ALLOCATION_MANAGER;
const DELEGATION_MANAGER = process.env.DELEGATION_MANAGER;

const abiAlloc = ["function getOperatorAVSData(address, address) view returns (uint256,uint256,uint256)"];
const abiDeleg = ["function getDelegation(address) view returns (uint256,uint256,bool)"];



const provider = new ethers.JsonRpcProvider(RPC);
const allocManager = new ethers.Contract(ALLOCATION_MANAGER, abiAlloc, provider);
const delegManager = new ethers.Contract(DELEGATION_MANAGER, abiDeleg, provider);

async function checkOperator(operatorAddress) {
    const [shares] = await allocManager.getOperatorAVSData(operatorAddress, process.env.AVS_ADDRESS);
    const [delegationShares,, isDelegated] = await delegManager.getDelegation(operatorAddress);
    console.log(`Operator: ${operatorAddress}\nAllocated Shares: ${shares}\nDelegated Shares: ${delegationShares}\nActive Delegation: ${isDelegated}`);
}

checkOperator("0xYourOperatorAddressHere");
