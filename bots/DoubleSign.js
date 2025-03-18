const { ethers, Wallet } = require("ethers");
require("dotenv").config();

const RPC = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const DOUBLESIGN_CONTRACT = process.env.DOUBLESIGN_CONTRACT;

const provider = new ethers.JsonRpcProvider(RPC);
const signer = new Wallet(PRIVATE_KEY, provider);

const doubleSignABI = [
  "function slashIfViolated(address operator, bytes32 hash1, bytes sig1, bytes32 hash2, bytes sig2) external returns (bool)"
];

const doubleSign = new ethers.Contract(DOUBLESIGN_CONTRACT, doubleSignABI, signer);

function formatSig(sig) {
  return ethers.concat([sig.r, sig.s, ethers.toBeHex(sig.v)]);
}

async function simulateDoubleSignSlashing() {
  const operator = signer.address;

  const hash1 = ethers.keccak256(ethers.toUtf8Bytes("BlockHeader_1"));
  const hash2 = ethers.keccak256(ethers.toUtf8Bytes("BlockHeader_2"));

  const sig1raw = signer.signingKey.sign(hash1);
  const sig2raw = signer.signingKey.sign(hash2);

  const sig1 = formatSig(await sig1raw);
  const sig2 = formatSig(await sig2raw);

  try {
    const tx = await doubleSign.slashIfViolated(operator, hash1, sig1, hash2, sig2);
    await tx.wait();
    console.log("✅ Slashing triggered successfully");
  } catch (err) {
    console.error("❌ Slashing failed:", err.reason || err.message);
  }
}

simulateDoubleSignSlashing();
