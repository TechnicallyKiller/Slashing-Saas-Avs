const { ethers } = require("ethers");
const fs = require("fs");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const utils = new ethers.Contract(process.env.VALIDATOR_UTILS, ["function markOperatorSlashed(address)"], wallet);

const data = JSON.parse(fs.readFileSync("doubleSignOperators.json", "utf8"));

async function checkDoubleSign() {
    for (let item of data) {
        const signer1 = ethers.verifyMessage(item.message1, item.signature1);
        const signer2 = ethers.verifyMessage(item.message2, item.signature2);

        if (signer1 === signer2 && item.message1 !== item.message2) {
            const tx = await utils.markOperatorSlashed(item.operator);
            await tx.wait();
            console.log(`⚠️ Slashed double-signing operator: ${item.operator}`);
        }
    }
}
checkDoubleSign();
