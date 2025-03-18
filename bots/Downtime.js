const fs = require("fs");
require("dotenv").config();
const { ethers } = require("ethers");



const RPC = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const REPORTER_ADDRESS = process.env.REPORTER_ADDRESS;
const OPERATOR_REGISTRY = process.env.OPERATOR_REGISTRY;
console.log("🔍 ENV CHECK:");
console.log("RPC:", RPC);
console.log("PRIVATE_KEY:", PRIVATE_KEY ? "✅ loaded" : "❌ MISSING");
console.log("REPORTER_ADDRESS:", REPORTER_ADDRESS);
console.log("OPERATOR_REGISTRY:", OPERATOR_REGISTRY);


const reporterABI = ["function reportHealth(address operator, uint256 blockNumber) external"];
const registryABI = ["function getAllOperators() external view returns (address[])"];

const provider = new ethers.JsonRpcProvider(RPC);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

const reporter = new ethers.Contract(REPORTER_ADDRESS, reporterABI, signer);
const registry = new ethers.Contract(OPERATOR_REGISTRY, registryABI, provider);

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

            const shouldSimulateSlashing = Math.random() < 0.5;
            const status = shouldSimulateSlashing ? "Slashed" : "Healthy";

            operatorData.push({
                operator: operator,
                status: status,
                lastCheckedBlock: latestBlock,
                details: status === "Slashed" ? "No activity in last 100 blocks (simulated)" : "Health reported successfully"
            });
             // 50% chance
            if (shouldSimulateSlashing) {
              console.log(`⚠️ Potential Slashing Triggered for ${operator} — Reason: Inactive for too long`);
            }

        } catch (e) {
            console.error(`❌ Error for ${operator}:`, e.message);
            operatorData.push({
              operator: operator,
              status: "Error",
              lastCheckedBlock: latestBlock,
              details: e.message
          });
        }
    }
    try {
      fs.writeFileSync("../frontend/public/operators.json", JSON.stringify(operatorData, null, 2));
      console.log("💾 operators.json updated.");
    } catch (err) {
      console.error("❌ Failed to write operators.json:", err.message);
    }
}



async function main() {
    console.log("🚀 Starting Downtime Bot...");
    await pingOperators();
    setInterval(pingOperators, 60 * 1000);
  }
  
  main().catch((err) => {
    console.error("❌ Fatal Error in bot execution:", err);
  });
