// hooks/useContract.ts

import { useMemo } from "react";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract";
import { useWalletClient, usePublicClient } from "wagmi";

export const useContract = () => {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const contract = useMemo(() => {
    if (!publicClient) return null;
    return {
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      publicClient,
      walletClient,
    };
  }, [publicClient, walletClient]);

  return contract;

};
