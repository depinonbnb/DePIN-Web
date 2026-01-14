import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';

interface WalletContextType {
  address: string | null;
  signer: ethers.Signer | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  changeWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check if already connected
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Check if user manually disconnected
          const wasDisconnected = localStorage.getItem('walletDisconnected');
          if (wasDisconnected === 'true') {
            return; // Don't auto-reconnect
          }

          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            setSigner(signer);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', async (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            setSigner(signer);
          } catch (error) {
            console.error('Error getting signer:', error);
          }
        } else {
          setAddress(null);
          setSigner(null);
        }
      });
    }

    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('MetaMask is not installed. Please install MetaMask to continue.');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAddress(accounts[0]);
      
      // Get signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setSigner(signer);
      
      // Clear disconnect flag when connecting
      localStorage.removeItem('walletDisconnected');
      
      toast.success('Wallet connected successfully!');
    } catch (error: any) {
      if (error.code === 4001) {
        toast.error('Connection request rejected');
      } else {
        toast.error('Failed to connect wallet');
      }
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setSigner(null);
    // Set flag to prevent auto-reconnect on refresh
    localStorage.setItem('walletDisconnected', 'true');
    toast.success('Wallet disconnected');
  };

  const changeWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('MetaMask is not installed');
      return;
    }

    try {
      // Request account change from MetaMask
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      });
      
      // MetaMask will trigger accountsChanged event automatically
      toast.success('Wallet changed successfully!');
    } catch (error: any) {
      if (error.code === 4001) {
        toast.error('Wallet change request rejected');
      } else {
        toast.error('Failed to change wallet');
      }
      console.error('Error changing wallet:', error);
    }
  };

  return (
    <WalletContext.Provider value={{ address, signer, isConnecting, connectWallet, disconnectWallet, changeWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

