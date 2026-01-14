// Smart Contract Integration for BNB DePIN
import { ethers } from 'ethers';
import DePINStakingABI from '../contracts/DePINStaking.json';
import DePINPointsABI from '../contracts/DePINPoints.json';

// Contract addresses (update these after deployment)
export const STAKING_CONTRACT_ADDRESS = import.meta.env.VITE_STAKING_CONTRACT_ADDRESS || '0x27bBD5698D8Db1335D7A026DEbA260305813a86f';
export const POINTS_CONTRACT_ADDRESS = import.meta.env.VITE_POINTS_CONTRACT_ADDRESS || '0x04F82418aAEF206e3733fA2eAFe4B8C5E0580e6e';
export const NETWORK_ID = parseInt(import.meta.env.VITE_NETWORK_ID || '97'); // BSC Testnet

// Network configuration
export const BSC_TESTNET = {
  chainId: '0x61', // 97 in hex
  chainName: 'BSC Testnet',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'tBNB',
    decimals: 18
  },
  rpcUrls: ['https://data-seed-prebsc-1-s1.bnbchain.org:8545/'],
  blockExplorerUrls: ['https://testnet.bscscan.com/']
};

// Get contract instances
export function getStakingContract(provider: ethers.BrowserProvider | ethers.Signer) {
  if (!STAKING_CONTRACT_ADDRESS) {
    throw new Error('Staking contract address not configured');
  }
  return new ethers.Contract(STAKING_CONTRACT_ADDRESS, DePINStakingABI, provider);
}

export function getPointsContract(provider: ethers.BrowserProvider | ethers.Signer) {
  if (!POINTS_CONTRACT_ADDRESS) {
    throw new Error('Points contract address not configured');
  }
  return new ethers.Contract(POINTS_CONTRACT_ADDRESS, DePINPointsABI, provider);
}

// Check if user is on correct network
export async function checkNetwork(provider: ethers.BrowserProvider): Promise<boolean> {
  try {
    const network = await provider.getNetwork();
    return Number(network.chainId) === NETWORK_ID;
  } catch (error) {
    console.error('Error checking network:', error);
    return false;
  }
}

// Switch to BSC Testnet
export async function switchToBSCTestnet(): Promise<boolean> {
  try {
    await window.ethereum?.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BSC_TESTNET.chainId }],
    });
    return true;
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum?.request({
          method: 'wallet_addEthereumChain',
          params: [BSC_TESTNET],
        });
        return true;
      } catch (addError) {
        console.error('Error adding BSC Testnet:', addError);
        return false;
      }
    }
    console.error('Error switching to BSC Testnet:', switchError);
    return false;
  }
}

// Register a node on-chain
export async function registerNodeOnChain(
  signer: ethers.Signer,
  nodeId: string,
  stakeAmount: string
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    const contract = getStakingContract(signer);
    const tx = await contract.registerNode(nodeId, {
      value: ethers.parseEther(stakeAmount)
    });
    
    await tx.wait();
    
    return {
      success: true,
      txHash: tx.hash
    };
  } catch (error: any) {
    console.error('Error registering node:', error);
    return {
      success: false,
      error: error.message || 'Failed to register node'
    };
  }
}

// Unstake and cancel node (deregisters and returns stake)
export async function unstakeNode(
  signer: ethers.Signer
): Promise<{ success: boolean; txHash?: string; error?: string; amount?: string }> {
  try {
    const contract = getStakingContract(signer);
    
    // Get stake amount before unstaking
    const signerAddress = await signer.getAddress();
    const nodeInfo = await contract.nodes(signerAddress);
    const stakeAmount = ethers.formatEther(nodeInfo.stakedAmount);
    
    const tx = await contract.unstake();
    await tx.wait();
    
    return {
      success: true,
      txHash: tx.hash,
      amount: stakeAmount
    };
  } catch (error: any) {
    console.error('Error unstaking node:', error);
    return {
      success: false,
      error: error.message || 'Failed to unstake node'
    };
  }
}

// Get node info from blockchain
export async function getNodeInfoFromChain(
  provider: ethers.BrowserProvider,
  address: string
): Promise<any> {
  try {
    const contract = getStakingContract(provider);
    const nodeInfo = await contract.nodes(address);
    
    return {
      nodeId: nodeInfo.nodeId,
      stakeAmount: ethers.formatEther(nodeInfo.stakeAmount),
      isActive: nodeInfo.isActive,
      registeredAt: new Date(Number(nodeInfo.registeredAt) * 1000).toISOString()
    };
  } catch (error) {
    console.error('Error fetching node info from chain:', error);
    return null;
  }
}

// Get points balance
export async function getPointsBalance(
  provider: ethers.BrowserProvider,
  address: string
): Promise<string> {
  try {
    const contract = getPointsContract(provider);
    const balance = await contract.getPoints(address);
    
    return balance.toString();
  } catch (error) {
    console.error('Error fetching points balance:', error);
    return '0';
  }
}

// Check minimum stake amount
export async function getMinimumStake(provider: ethers.BrowserProvider): Promise<string> {
  try {
    const contract = getStakingContract(provider);
    const minStake = await contract.minimumStake();
    
    return ethers.formatEther(minStake);
  } catch (error) {
    console.error('Error fetching minimum stake:', error);
    return '0.1'; // Default
  }
}

