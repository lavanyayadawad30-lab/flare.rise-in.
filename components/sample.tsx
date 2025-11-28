// components/sample.tsx

"use client";
import { useState } from "react";
import { useAccount } from "wagmi";
import { formatEther, parseEther } from "viem";
import { useContract } from "@/hooks/useContract";

export default function SampleUI() {
  const { isConnected, address } = useAccount();
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const contract = useContract();

  const handleDeposit = async () => {
    try {
      setError("");
      setLoading(true);
      if (!contract?.walletClient) throw new Error("Wallet not connected");

      await contract.walletClient.writeContract({
        address: contract.address,
        abi: contract.abi,
        functionName: "deposit",
        value: parseEther(amount),
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetBalance = async () => {
    try {
      setError("");
      setLoading(true);
      if (!contract) throw new Error("Contract not ready");

      const result = await contract.publicClient.readContract({
        address: contract.address,
        abi: contract.abi,
        functionName: "getBalance",
        args: [address!],
      });

      setBalance(formatEther(result as bigint));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return <p>Please connect your wallet</p>;
  }

  return (
    <div style={{ padding: 16, border: "1px solid #444", borderRadius: 8 }}>
      <h3>Simple Ledger UI</h3>

      <p>Connected: {address}</p>

      <input
        type="text"
        placeholder="Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ padding: 8 }}
      />

      <button disabled={loading} onClick={handleDeposit} style={{ marginLeft: 8 }}>
        Deposit
      </button>

      <button disabled={loading} onClick={handleGetBalance} style={{ marginLeft: 8 }}>
        Get Balance
      </button>

      <p>Ledger Balance: {balance} ETH</p>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}
    </div>
  );
}
