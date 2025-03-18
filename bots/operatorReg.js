require("dotenv").config();
const { ethers } = require("ethers");

const RPC = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const OPERATOR_REGISTRY = process.env.OPERATOR_REGISTRY;

const registryABI = [
  "function registerOperator(address operator) external"
];



const provider = new ethers.JsonRpcProvider(RPC);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const registry = new ethers.Contract(OPERATOR_REGISTRY, registryABI, signer);

const dummyOperators = [
  "0x1111111111111111111111111111111111111111",
  "0x2222222222222222222222222222222222222222",
  "0x3333333333333333333333333333333333333333"
];

async function registerDummyOperators() {
  for (const op of dummyOperators) {
    try {
      const tx = await registry.registerOperator(op);
      await tx.wait();
      console.log(`✅ Registered operator: ${op}`);
    } catch (err) {
      console.error(`❌ Failed to register ${op}: ${err.message}`);
    }
  }
}

registerDummyOperators();
