const { ethers, Wallet } = require("ethers");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const RPC = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const DOUBLESIGN_CONTRACT = process.env.DOUBLESIGN_CONTRACT;
const INPUT_PATH = path.join(__dirname, "doubleSignInputs.json");
const OUTPUT_PATH = path.join(__dirname, "../frontend/public/operators.json");

const provider = new ethers.JsonRpcProvider(RPC);
const signer = new Wallet(PRIVATE_KEY, provider);

const doubleSignABI = [
  "function slashIfViolated(address operator, bytes32 hash1, bytes sig1, bytes32 hash2, bytes sig2) external returns (bool)"
];

const doubleSign = new ethers.Contract(DOUBLESIGN_CONTRACT, doubleSignABI, signer);

function formatSig(sig) {
  return ethers.concat([sig.r, sig.s, ethers.toBeHex(sig.v)]);
}

async function simulateDoubleSignFromJSON() {
  const inputData = JSON.parse(fs.readFileSync(INPUT_PATH, "utf-8"));
  const operatorsJson = fs.existsSync(OUTPUT_PATH)
    ? JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"))
    : [];

  for (const entry of inputData) {
    const operator = entry.operator;
    const hash1 = ethers.keccak256(ethers.toUtf8Bytes(entry.message1));
    const hash2 = ethers.keccak256(ethers.toUtf8Bytes(entry.message2));

    const sig1raw = signer.signingKey.sign(hash1);
    const sig2raw = signer.signingKey.sign(hash2);
    const sig1 = formatSig(await sig1raw);
    const sig2 = formatSig(await sig2raw);

    try {
      const tx = await doubleSign.slashIfViolated(operator, hash1, sig1, hash2, sig2);
      await tx.wait();
      console.log(`✅ Slashing triggered successfully for ${operator}`);

      // Update frontend JSON
      const updated = operatorsJson.map(op =>
        op.operator.toLowerCase() === operator.toLowerCase()
          ? { ...op, signatureMismatch: true, status: "Slashed", details: "Double Signature Violation" }
          : op
      );
      fs.writeFileSync(OUTPUT_PATH, JSON.stringify(updated, null, 2));
      console.log(`📁 operators.json updated for ${operator}`);
    } catch (err) {
      console.error(`❌ Slashing failed for ${operator}:`, err.reason || err.message);
    }
  }
}

simulateDoubleSignFromJSON();
