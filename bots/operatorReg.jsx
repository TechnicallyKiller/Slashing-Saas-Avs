// components/OperatorRegistrationForm.jsx
import { useState } from "react";
import { ethers } from "ethers";

export default function OperatorRegistrationForm() {
  const [approver, setApprover] = useState("");
  const [metadataURI, setMetadataURI] = useState("");
  const [status, setStatus] = useState("");
  const [txHash, setTxHash] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("⏳ Registering operator...");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const registryAddress = process.env.NEXT_PUBLIC_OPERATOR_REGISTRY;
      const registryABI = [
        "function registerOperator(address initDelegationApprover, string metadataURI) external",
      ];

      const registry = new ethers.Contract(registryAddress, registryABI, signer);
      const tx = await registry.registerOperator(approver, metadataURI);
      await tx.wait();

      setTxHash(tx.hash);
      setStatus("✅ Operator successfully registered!");
    } catch (err) {
      console.error(err);
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Operator Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Delegation Approver Address</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="0x..."
            value={approver}
            onChange={(e) => setApprover(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Metadata URI</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="ipfs://... or your JSON endpoint"
            value={metadataURI}
            onChange={(e) => setMetadataURI(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Register Operator
        </button>
      </form>

      {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
      {txHash && (
        <p className="mt-2 text-sm text-blue-600">
          View Tx: <a href={`https://holesky.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer">{txHash}</a>
        </p>
      )}
    </div>
  );
}
