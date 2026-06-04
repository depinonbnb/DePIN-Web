import { useState, useEffect } from 'react';
import { useWallet } from '../lib/wallet';
import { registerNodeOnChain, switchToBSCTestnet, getMinimumStake, checkNetwork } from '../lib/contracts';
import {
  registerNode,
  NODE_TYPES,
  VERIFICATION_METHODS,
  type NodeType,
  type VerificationMethod,
} from '../lib/api';
import { ethers } from 'ethers';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle, XCircle, Info, Copy, Terminal, Download, ArrowRight, ExternalLink } from 'lucide-react';

function isValidRpcUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function Register() {
  const { address, signer, isConnecting } = useWallet();
  const [nodeId, setNodeId] = useState('');
  const [nodeType, setNodeType] = useState<NodeType>('bsc-full');
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>('exposed-rpc');
  const [rpcEndpoint, setRpcEndpoint] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('0.1');
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [hasEnoughBalance, setHasEnoughBalance] = useState(false);
  const [registeredNodeId, setRegisteredNodeId] = useState<string | null>(null);
  const [registeredTxHash, setRegisteredTxHash] = useState<string | null>(null);

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

    if (verificationMethod === 'exposed-rpc' && !isValidRpcUrl(rpcEndpoint)) {
      setStatus('ERROR: Enter a valid public RPC URL (http:// or https://) for the exposed-RPC method');
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
      
      // Register in backend (Phase 3 protocol — nonce + timestamp + EIP-191 signed message built inside api.registerNode)
      setStatus('Registering node in backend (please approve the signature in your wallet)...');

      const backendResult = await registerNode({
        signer,
        walletAddress: address,
        nodeType,
        verificationMethod,
        rpcEndpoint: verificationMethod === 'exposed-rpc' ? rpcEndpoint : undefined,
      });

      if (backendResult.success) {
        setRegisteredNodeId(backendResult.nodeId || nodeId);
        setRegisteredTxHash(txHash || null);
        setStatus('SUCCESS');
      } else {
        const txInfo = txHash ? ` Tx: ${txHash}` : '';
        setStatus(`WARNING: Backend registration failed.${txInfo} ${backendResult.message}`);
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
                    <Terminal className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Registration via the Prover CLI</h3>
                    <p className="text-muted-foreground text-sm">
                      Node registration is handled through the open-source prover, not the website.
                      Sync your BNB Chain node, then follow the steps on the right to register and
                      start earning. The "What Happens Next?" panel walks you through it.
                    </p>
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

                  <div>
                    <Label htmlFor="node-type">Node Type</Label>
                    <Select
                      value={nodeType}
                      onValueChange={(v) => setNodeType(v as NodeType)}
                      disabled={loading}
                    >
                      <SelectTrigger id="node-type" className="mt-2">
                        <SelectValue placeholder="Pick a node type" />
                      </SelectTrigger>
                      <SelectContent>
                        {NODE_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            <div className="flex flex-col items-start">
                              <span>{t.label}</span>
                              <span className="text-xs text-muted-foreground">{t.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="verification-method">Verification Method</Label>
                    <Select
                      value={verificationMethod}
                      onValueChange={(v) => setVerificationMethod(v as VerificationMethod)}
                      disabled={loading}
                    >
                      <SelectTrigger id="verification-method" className="mt-2">
                        <SelectValue placeholder="How should we verify your node?" />
                      </SelectTrigger>
                      <SelectContent>
                        {VERIFICATION_METHODS.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            <div className="flex flex-col items-start">
                              <span>{m.label}</span>
                              <span className="text-xs text-muted-foreground">{m.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {verificationMethod === 'exposed-rpc' && (
                    <div>
                      <Label htmlFor="rpc-endpoint">Node RPC URL</Label>
                      <Input
                        id="rpc-endpoint"
                        type="url"
                        value={rpcEndpoint}
                        onChange={(e) => setRpcEndpoint(e.target.value)}
                        placeholder="https://your-node.example.com:8545"
                        disabled={loading}
                        className="mt-2"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Public URL where your BNB node's JSON-RPC is reachable. Must be http(s) and publicly addressable.
                      </p>
                    </div>
                  )}

                  {verificationMethod === 'local-prover' && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-sm text-muted-foreground">
                      You'll need to run the open-source <span className="font-mono text-foreground">prover</span> CLI on your machine after
                      registration. It polls the API on your behalf — no public RPC required. See the README for setup.
                    </div>
                  )}

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
                    disabled={
                      loading ||
                      !nodeId ||
                      isConnecting ||
                      (verificationMethod === 'exposed-rpc' && !isValidRpcUrl(rpcEndpoint))
                    }
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

          {registeredNodeId ? (
            <SuccessCard
              nodeId={registeredNodeId}
              walletAddress={address || ''}
              nodeType={nodeType}
              verificationMethod={verificationMethod}
              txHash={registeredTxHash}
              onRegisterAnother={() => {
                setRegisteredNodeId(null);
                setRegisteredTxHash(null);
                setStatus('');
                setNodeId('');
                setRpcEndpoint('');
              }}
            />
          ) : (
            <Card className="bg-card border-border p-6">
              <h2 className="text-2xl text-foreground mb-6">What Happens Next?</h2>
              <ol className="space-y-4 mb-6">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">1</span>
                  <div>
                    <strong className="text-foreground">Register on-chain</strong>
                    <p className="text-sm text-muted-foreground mt-1">Your node will be registered on the BSC smart contract with a signed message from your wallet</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">2</span>
                  <div>
                    <strong className="text-foreground">Download Prover CLI</strong>
                    <p className="text-sm text-muted-foreground mt-1">Download and install the prover software on your computer</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">3</span>
                  <div>
                    <strong className="text-foreground">Configure your node RPC</strong>
                    <p className="text-sm text-muted-foreground mt-1">Point the prover to your local BSC/opBNB node's RPC endpoint</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">4</span>
                  <div>
                    <strong className="text-foreground">Prove & Earn</strong>
                    <p className="text-sm text-muted-foreground mt-1">Prover handles verifications every 5 min. Earn points for uptime + successful verifications</p>
                  </div>
                </li>
              </ol>

              <div className="border-t border-border pt-6">
                <h3 className="text-foreground font-medium mb-4">Download Prover CLI</h3>
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
          )}
        </div>
      </div>
    </div>
  );
}

interface SuccessCardProps {
  nodeId: string;
  walletAddress: string;
  nodeType: NodeType;
  verificationMethod: VerificationMethod;
  txHash: string | null;
  onRegisterAnother: () => void;
}

function SuccessCard({ nodeId, walletAddress, nodeType, verificationMethod, txHash, onRegisterAnother }: SuccessCardProps) {
  const [copied, setCopied] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'https://api.depinonbnb.com/api';

  const cliConfig = [
    `export PROVER_PRIVATE_KEY="<your-wallet-private-key>"`,
    `export NODE_RPC="http://localhost:8545"`,
    `export DEPIN_API="${apiUrl}"`,
    `export NODE_TYPE="${nodeType}"`,
    `./prover`,
  ].join('\n');

  const copyConfig = async () => {
    await navigator.clipboard.writeText(cliConfig);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-card border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Node Registered</h2>
          <p className="text-sm text-muted-foreground">your node is live on the network</p>
        </div>
      </div>

      <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">node id</span>
          <span className="font-mono text-foreground">{nodeId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">wallet</span>
          <span className="font-mono text-foreground">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">type</span>
          <span className="text-foreground">{nodeType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">verification</span>
          <span className="text-foreground">{verificationMethod}</span>
        </div>
        {txHash && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">tx</span>
            <a
              href={`https://testnet.bscscan.com/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-primary text-xs hover:underline inline-flex items-center gap-1"
            >
              {txHash.slice(0, 10)}...{txHash.slice(-6)} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      {verificationMethod === 'local-prover' && (
        <>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" />
                <h3 className="text-foreground font-medium">run the prover</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={copyConfig} className="text-xs">
                {copied ? <CheckCircle className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                {copied ? 'copied' : 'copy'}
              </Button>
            </div>
            <pre className="bg-muted text-foreground rounded-lg p-4 text-xs font-mono overflow-x-auto whitespace-pre leading-relaxed">
              {cliConfig}
            </pre>
            <p className="text-xs text-muted-foreground mt-2">
              replace <span className="font-mono text-foreground">&lt;your-wallet-private-key&gt;</span> with the private key for{' '}
              <span className="font-mono">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>.
              the prover signs challenge responses with this key — never share it.
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Download className="w-4 h-4 text-primary" />
              <h3 className="text-foreground font-medium">download prover cli</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" disabled>
                Linux
              </Button>
              <Button variant="outline" size="sm" disabled>
                macOS
              </Button>
              <Button variant="outline" size="sm" disabled>
                Windows
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              binaries coming soon. for now, build from source: <span className="font-mono">go build -o prover ./cmd/prover</span>
            </p>
          </div>
        </>
      )}

      {verificationMethod === 'exposed-rpc' && (
        <div className="mb-6 bg-accent/5 border border-accent/20 rounded-lg p-4">
          <h3 className="text-foreground font-medium mb-1">you're all set</h3>
          <p className="text-sm text-muted-foreground">
            the server will start probing your node's RPC endpoint automatically every few minutes.
            no CLI needed — just keep your node online. points accrue with each passed challenge and uptime tick.
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Link to="/explorer">
          <Button className="w-full" variant="outline">
            view your node in the explorer <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
        <Button className="w-full" variant="ghost" onClick={onRegisterAnother}>
          register another node
        </Button>
      </div>
    </Card>
  );
}
