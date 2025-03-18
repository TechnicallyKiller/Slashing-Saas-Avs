const { ethers, Wallet } = require("ethers");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const RPC = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const DOUBLESIGN_CONTRACT = process.env.DOUBLESIGN_CONTRACT;

const provider = new ethers.JsonRpcProvider(RPC);
const signer = new Wallet(PRIVATE_KEY, provider);
const operator = signer.address;

const OUTPUT_PATH = path.join(__dirname, "../frontend/public/operators.json");

const doubleSignABI = [
  "function slashIfViolated(address operator, bytes32 hash1, bytes sig1, bytes32 hash2, bytes sig2) external returns (bool)"
];

const doubleSign = new ethers.Contract(DOUBLESIGN_CONTRACT, doubleSignABI, signer);

function formatSig(sig) {
  return ethers.concat([sig.r, sig.s, ethers.toBeHex(sig.v)]);
}

async function simulateDoubleSignSlashing() {
  const hash1 = ethers.keccak256(ethers.toUtf8Bytes("BlockHeader_1"));
  const hash2 = ethers.keccak256(ethers.toUtf8Bytes("BlockHeader_2"));

  const sig1raw = signer.signingKey.sign(hash1);
  const sig2raw = signer.signingKey.sign(hash2);

  const sig1 = formatSig(sig1raw);
  const sig2 = formatSig(sig2raw);

  try {
    const tx = await doubleSign.slashIfViolated(operator, hash1, sig1, hash2, sig2);
    await tx.wait();
    console.log(`✅ Slashing triggered successfully for ${operator}`);
  } catch (err) {
    console.error("❌ Slashing failed:", err.reason || err.message);
  }

  // Update UI JSON
  try {
    const operators = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"));
    const updated = operators.map(op =>
      op.operator.toLowerCase() === operator.toLowerCase()
        ? {
            ...op,
            signatureMismatch: true,
            status: "Slashed",
            details: "Double Signature Violation"
          }
        : op
    );
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(updated, null, 2));
    console.log("📁 operators.json updated with double sign slashing");
  } catch (err) {
    console.error("❌ Failed to update operators.json:", err.message);
  }
}

simulateDoubleSignSlashing();
