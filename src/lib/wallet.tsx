import { ReactNode } from 'react';
import { ethers } from 'ethers';

// Wallet connection has been removed from the site. This stub keeps the
// useWallet() API in place so pages render their disconnected state without
// ever prompting a wallet. Re-add a real provider here to bring it back.

interface WalletContextType {
  address: string | null;
  signer: ethers.Signer | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  changeWallet: () => Promise<void>;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useWallet(): WalletContextType {
  return {
    address: null,
    signer: null,
    isConnecting: false,
    connectWallet: async () => {},
    disconnectWallet: () => {},
    changeWallet: async () => {},
  };
}

// Type declaration for window.ethereum (used by remaining read-only on-chain lookups)
declare global {
  interface Window {
    ethereum?: any;
  }
}
