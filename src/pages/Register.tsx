

import { useState, useEffect } from 'react';
import { useWallet } from '../lib/wallet';
import { registerNodeOnChain, switchToBSCTestnet, getMinimumStake, checkNetwork } from '../lib/contracts';
import { registerNode } from '../lib/api';
import { ethers } from 'ethers';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { AlertTriangle, CheckCircle, XCircle, Info, Wallet } from 'lucide-react';

export function Register() {
  const { address, signer, isConnecting, connectWallet } = useWallet();
  const [nodeId, setNodeId] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('0.1');
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [hasEnoughBalance, setHasEnoughBalance] = useState(false);

  // Check network and balance when wallet connects
  useEffect(() => {
    const checkRequirements = async () => {
      if (signer && address) {
        try {
          const provider = signer.provider as any;
          
          // Check network
          const network = await provider.getNetwork();
          setIsCorrectNetwork(Number(network.chainId) === 97);
          
          // Check balance
          const balance = await provider.getBalance(address);
          const balanceInBNB = Number(ethers.formatEther(balance));
          setHasEnoughBalance(balanceInBNB >= parseFloat(stakeAmount));
        } catch (error) {
          console.error('Error checking requirements:', error);
        }
      }
    };
    
    if (signer && address) {
      checkRequirements();
    }
  }, [signer, address, stakeAmount]);

  const generateNodeId = () => {
    if (address) {
      // Use characters from wallet address + 3 random characters for uniqueness
      const addressPart = address.slice(2, 10).toLowerCase();
      const randomSuffix = Math.random().toString(36).substring(2, 5); // 3 random chars
      setNodeId(`node-${addressPart}${randomSuffix}`);
    } else {
      // Fallback to random if no address
      const randomId = `node-${Math.random().toString(36).substring(2, 10)}`;
      setNodeId(randomId);
    }
  };

  const handleRegister = async () => {
    if (!address || !signer) {
      setStatus('ERROR: Please connect your wallet first');
      return;
    }

    if (!nodeId || nodeId.length < 5) {
      setStatus('ERROR: Please enter a valid node ID (min 5 characters)');
      return;
    }

    try {
      setLoading(true);
      
      // Check network
      setStatus('Checking network...');
      const provider = signer.provider as any;
      const isCorrectNetwork = await checkNetwork(provider);
      
      if (!isCorrectNetwork) {
        setStatus('WARNING: Switching to BSC Testnet...');
        const switched = await switchToBSCTestnet();
        if (!switched) {
          setStatus('ERROR: Please manually switch to BSC Testnet (Chain ID: 97) in MetaMask');
          setLoading(false);
          return;
        }
      }

      // Check wallet balance
      setStatus('Checking wallet balance...');
      const balance = await provider.getBalance(address);
      const balanceInBNB = parseFloat(balance.toString()) / 1e18;
      
      if (balanceInBNB < 0.11) {
        setStatus(`ERROR: Insufficient BNB. You need at least 0.11 BNB (0.1 for stake + 0.01 for fees). Current balance: ${balanceInBNB.toFixed(4)} BNB. Get free testnet BNB at: https://testnet.bnbchain.org/faucet-smart`);
        setLoading(false);
        return;
      }

      // Get minimum stake
      setStatus('Getting stake requirements...');
      const minStake = await getMinimumStake(provider);
      setStakeAmount(minStake);

      // Register on-chain
      setStatus('Registering node on blockchain...');
      const result = await registerNodeOnChain(signer, nodeId, minStake);

      // Check if already registered on-chain
      let txHash = result.txHash || '';
      if (!result.success && result.error?.includes('Already registered')) {
        setStatus('Already registered on-chain. Registering in backend...');
        txHash = '';
      } else if (!result.success) {
        // Better error messages
        let errorMsg = result.error || 'Registration failed';
        
        if (errorMsg.includes('insufficient funds') || errorMsg.includes('insufficient balance')) {
          errorMsg = 'ERROR: Not enough BNB for gas fees. Get free testnet BNB at: https://testnet.bnbchain.org/faucet-smart';
        } else if (errorMsg.includes('user rejected') || errorMsg.includes('User denied')) {
          errorMsg = 'ERROR: Transaction rejected. Please approve the transaction in MetaMask to continue.';
        } else if (errorMsg.includes('missing revert data') || errorMsg.includes('execution reverted')) {
          errorMsg = 'ERROR: Transaction failed. Make sure you are on BSC Testnet (Chain ID: 97) and have at least 0.11 BNB (0.1 for stake + 0.01 for fees).';
        } else if (errorMsg.includes('network')) {
          errorMsg = 'ERROR: Network error. Please check your internet connection and try again.';
        } else {
          errorMsg = `ERROR: ${errorMsg}`;
        }
        
        setStatus(errorMsg);
        setLoading(false);
        return;
      } else {
        setStatus('Transaction sent. Waiting for confirmation...');
      }
      
      // Register in backend
      setStatus('Registering node in backend...');
      
      // Sign the nodeId for backend verification
      const message = `Register node: ${nodeId}`;
      const signature = await signer.signMessage(message);
      
      const backendResult = await registerNode({
        address,
        nodeId,
        signature,
        rpcUrl: ''
      });

      if (backendResult.success) {
        const txInfo = txHash ? ` Tx: ${txHash}` : '';
        setStatus(`SUCCESS: Node registered successfully!${txInfo}`);
        setNodeId('');
      } else {
        const txInfo = txHash ? ` Tx: ${txHash}` : '';
        setStatus(`WARNING: Backend registration failed.${txInfo} Error: ${backendResult.message}`);
      }

      setLoading(false);

    } catch (error: any) {
      console.error('Error registering node:', error);
      
      // Parse common errors
      let errorMsg = error.message || 'Registration failed';
      
      if (errorMsg.includes('insufficient funds') || errorMsg.includes('insufficient balance')) {
        errorMsg = 'Not enough BNB for gas fees. Get free testnet BNB at: https://testnet.bnbchain.org/faucet-smart';
      } else if (errorMsg.includes('user rejected') || errorMsg.includes('User denied')) {
        errorMsg = 'Transaction rejected. Please approve the transaction in MetaMask.';
      } else if (errorMsg.includes('missing revert data') || errorMsg.includes('execution reverted')) {
        errorMsg = 'Transaction failed. Check: 1) You are on BSC Testnet (Chain ID: 97) 2) You have at least 0.11 BNB 3) The contract is deployed';
      } else if (errorMsg.includes('network')) {
        errorMsg = 'Network error. Please check your connection and try again.';
      } else if (errorMsg.includes('nonce')) {
        errorMsg = 'Nonce error. Please reset your MetaMask account: Settings > Advanced > Reset Account';
      }
      
      setStatus(`ERROR: ${errorMsg}`);
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (status.startsWith('SUCCESS')) return <CheckCircle className="w-5 h-5 text-accent" />;
    if (status.startsWith('ERROR')) return <XCircle className="w-5 h-5 text-destructive" />;
    if (status.startsWith('WARNING')) return <AlertTriangle className="w-5 h-5 text-warning" />;
    return <Info className="w-5 h-5 text-primary" />;
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto">
        <h1 className="text-3xl sm:text-4xl text-foreground mb-8">Register Your Node</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Registration Form */}
          <Card className="bg-card border-border p-6">
            <h2 className="text-2xl text-foreground mb-6">Node Registration</h2>
            
            {!address ? (
              <div className="bg-card border border-primary/20 rounded-lg p-6 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Wallet className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Connect Your Wallet</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Please connect your MetaMask wallet to register a node
                    </p>
                    <Button onClick={connectWallet} disabled={isConnecting} size="lg">
                      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  <div>
                    <Label htmlFor="node-id">Node ID</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="node-id"
                        type="text"
                        value={nodeId}
                        onChange={(e) => setNodeId(e.target.value)}
                        placeholder="Enter unique node ID"
                        disabled={loading}
                        className="flex-1 text-[#D9A50A] font-medium"
                      />
                      <Button 
                        onClick={generateNodeId}
                        variant="outline"
                        disabled={loading}
                      >
                        Generate
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choose a unique identifier for your node (min 5 characters)
                    </p>
                  </div>

                  <div className="bg-muted border border-border rounded-lg p-4">
                    <h3 className="text-foreground font-medium mb-2">Registration Requirements:</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        {address ? <CheckCircle className="w-4 h-4 text-accent" /> : <XCircle className="w-4 h-4 text-destructive" />}
                        Connected wallet
                      </li>
                      <li className="flex items-center gap-2">
                        {isCorrectNetwork ? <CheckCircle className="w-4 h-4 text-accent" /> : <AlertTriangle className="w-4 h-4 text-warning" />}
                        BSC Testnet network
                      </li>
                      <li className="flex items-center gap-2">
                        {hasEnoughBalance ? <CheckCircle className="w-4 h-4 text-accent" /> : <AlertTriangle className="w-4 h-4 text-warning" />}
                        {stakeAmount} BNB minimum stake (testnet)
                      </li>
                      <li className="flex items-center gap-2">
                        {nodeId.length >= 5 ? <CheckCircle className="w-4 h-4 text-accent" /> : <XCircle className="w-4 h-4 text-destructive" />}
                        Unique node ID
                      </li>
                    </ul>
                  </div>

                  <Button 
                    onClick={handleRegister}
                    className="w-full"
                    disabled={loading || !nodeId || isConnecting}
                    size="lg"
                  >
                    {loading ? 'Registering...' : 'Register Node'}
                  </Button>
                </div>

                {status && (
                  <div className={`flex items-start gap-3 p-4 rounded-lg border ${
                    status.startsWith('SUCCESS') ? 'bg-accent/10 border-accent' :
                    status.startsWith('ERROR') ? 'bg-destructive/10 border-destructive' :
                    status.startsWith('WARNING') ? 'bg-warning/10 border-warning' :
                    'bg-primary/10 border-primary'
                  }`}>
                    {getStatusIcon()}
                    <p className="text-sm text-foreground flex-1">{status}</p>
                  </div>
                )}
              </>
            )}
          </Card>

          {/* Info Card */}
          <Card className="bg-card border-border p-6">
            <h2 className="text-2xl text-foreground mb-6">What Happens Next?</h2>
            <ol className="space-y-4 mb-6">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">1</span>
                <div>
                  <strong className="text-foreground">Register on-chain</strong>
                  <p className="text-sm text-muted-foreground mt-1">Your node will be registered on the BSC smart contract with your stake</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">2</span>
                <div>
                  <strong className="text-foreground">Download node software</strong>
                  <p className="text-sm text-muted-foreground mt-1">Download and install the node software on your computer</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">3</span>
                <div>
                  <strong className="text-foreground">Start sharing bandwidth</strong>
                  <p className="text-sm text-muted-foreground mt-1">Run the software to start sharing bandwidth and earning points</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">4</span>
                <div>
                  <strong className="text-foreground">Earn points</strong>
                  <p className="text-sm text-muted-foreground mt-1">Earn 100 points per GB of bandwidth shared</p>
                </div>
              </li>
            </ol>

            <div className="border-t border-border pt-6">
              <h3 className="text-foreground font-medium mb-4">Download Node Software</h3>
              <div className="grid grid-cols-3 gap-3">
                <Button variant="outline" className="w-full" disabled>
                  Windows
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  macOS
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  Linux
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Coming soon</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

