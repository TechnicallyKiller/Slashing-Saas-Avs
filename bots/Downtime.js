require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

const RPC = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const REPORTER_ADDRESS = process.env.REPORTER_ADDRESS;
const OPERATOR_REGISTRY = process.env.OPERATOR_REGISTRY;
const DOWNTIME_CONTRACT = process.env.DOWNTIME_CONTRACT;

console.log("🔍 ENV CHECK:");
console.log("RPC:", RPC);
console.log("PRIVATE_KEY:", PRIVATE_KEY ? "✅ loaded" : "❌ MISSING");
console.log("REPORTER_ADDRESS:", REPORTER_ADDRESS);
console.log("OPERATOR_REGISTRY:", OPERATOR_REGISTRY);
console.log("DOWNTIME_CONTRACT:", DOWNTIME_CONTRACT);

const reporterABI = ["function reportHealth(address operator, uint256 blockNumber) external"];
const registryABI = ["function getAllOperators() external view returns (address[])"];
const downtimeABI = ["function slashIfViolated(address operator) external returns (bool)"];

const provider = new ethers.JsonRpcProvider(RPC);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

const reporter = new ethers.Contract(REPORTER_ADDRESS, reporterABI, signer);
const registry = new ethers.Contract(OPERATOR_REGISTRY, registryABI, provider);
const downtime = new ethers.Contract(DOWNTIME_CONTRACT, downtimeABI, signer);

const OUTPUT_PATH = path.join(__dirname, "../frontend/public/operators.json");

async function pingOperators() {
  const latestBlock = await provider.getBlockNumber();
  console.log(`🔔 Latest block: ${latestBlock}`);

  const operators = await registry.getAllOperators();
  console.log(`📡 Found ${operators.length} operators:`, operators);

  const operatorData = [];

  for (const operator of operators) {
    try {
      const tx = await reporter.reportHealth(operator, latestBlock);
      await tx.wait();
      console.log(`✅ Reported health for ${operator} at block ${latestBlock}`);

      // 👇 Real on-chain slashing check (no simulation)
      const slashTx = await downtime.slashIfViolated(operator);
      const result = await slashTx.wait();

      if (result && result.status === 1) {
        console.log(`⚠️ Slashing executed for ${operator} via downtime violation`);
        operatorData.push({
          operator,
          status: "Slashed",
          lastCheckedBlock: latestBlock,
          details: "Downtime Violation Detected"
        });
      } else {
        operatorData.push({
          operator,
          status: "Healthy",
          lastCheckedBlock: latestBlock,
          details: "Health reported successfully"
        });
      }
    } catch (e) {
      console.error(`❌ Error for ${operator}:`, e.message);
      operatorData.push({
        operator,
        status: "Error",
        lastCheckedBlock: latestBlock,
        details: e.message
      });
    }
  }

 
}

async function main() {
  console.log("🚀 Starting Downtime Monitor...");
  await pingOperators();
  setInterval(pingOperators, 60 * 1000); // Repeat every 1 minute
}

main().catch((err) => {
  console.error("❌ Fatal Error in bot execution:", err);
});
