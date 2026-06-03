import { useState, useEffect } from 'react';
import { useWallet } from '../lib/wallet';
import { getStakingContract, unstakeNode, switchToBSCTestnet, checkNetwork } from '../lib/contracts';
import { ethers } from 'ethers';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Search, Wallet as WalletIcon, Activity, Clock, Award, AlertCircle, Trash2, Server, Shield, CheckCircle } from 'lucide-react';

interface NodeInfo {
  address: string;
  nodeId: string;
  stakedAmount: string;
  stakedAt: string;
  isActive: boolean;
  nodeType?: string;
  verificationMethod?: string;
  antiCheatStatus?: string;
  verificationsPassed?: number;
  lastVerified?: string;
}

export function Nodes() {
  const { address, signer } = useWallet();
  const [searchAddress, setSearchAddress] = useState('');
  const [myNodes, setMyNodes] = useState<NodeInfo[]>([]);
  const [searchedNode, setSearchedNode] = useState<NodeInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch user's own nodes
  useEffect(() => {
    if (address && signer) {
      fetchMyNodes();
    }
  }, [address, signer]);

  const fetchMyNodes = async () => {
    if (!address || !signer) return;

    try {
      setLoading(true);
      setError('');
      
      const provider = signer.provider as ethers.BrowserProvider;
      
      // Check if on correct network
      const network = await provider.getNetwork();
      if (Number(network.chainId) !== 97) {
        setError('Please switch to BSC Testnet (Chain ID: 97) in your wallet');
        setLoading(false);
        return;
      }
      
      const contract = getStakingContract(provider);
      
      // Check if user has a node registered
      const isRegistered = await contract.isRegisteredNode(address);
      
      if (isRegistered) {
        const nodeData = await contract.nodes(address);
        
        const nodeInfo: NodeInfo = {
          address: address,
          nodeId: nodeData.nodeId,
          stakedAmount: ethers.formatEther(nodeData.stakedAmount),
          stakedAt: new Date(Number(nodeData.stakedAt) * 1000).toLocaleString(),
          isActive: nodeData.isActive,
          nodeType: 'BSC Full', // TODO: Get from contract when available
          verificationMethod: 'Local Prover',
          antiCheatStatus: 'Clean',
          verificationsPassed: 0,
          lastVerified: '-'
        };

        setMyNodes([nodeInfo]);
      } else {
        setMyNodes([]);
      }
      
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching nodes:', err);
      let errorMsg = 'Failed to load your nodes';
      
      if (err.message.includes('network')) {
        errorMsg = 'Network error. Please check your connection and try again.';
      } else if (err.message.includes('user rejected')) {
        errorMsg = 'Request rejected. Please approve the connection in your wallet.';
      } else {
        errorMsg = `Error: ${err.message || 'Failed to load nodes'}`;
      }
      
      setError(errorMsg);
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchAddress) {
      setError('Please enter a valid address');
      return;
    }

    if (!ethers.isAddress(searchAddress)) {
      setError('Invalid Ethereum address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSearchedNode(null);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = getStakingContract(provider);
      
      // Check if address has a node
      const isRegistered = await contract.isRegisteredNode(searchAddress);
      
      if (!isRegistered) {
        setError('No node found for this address');
        setLoading(false);
        return;
      }
      
      const nodeData = await contract.nodes(searchAddress);
      
      const nodeInfo: NodeInfo = {
        address: searchAddress,
        nodeId: nodeData.nodeId,
        stakedAmount: ethers.formatEther(nodeData.stakedAmount),
        stakedAt: new Date(Number(nodeData.stakedAt) * 1000).toLocaleString(),
        isActive: nodeData.isActive,
        nodeType: 'BSC Full', // TODO: Get from contract when available
        verificationMethod: 'Local Prover',
        antiCheatStatus: 'Clean',
        verificationsPassed: 0,
        lastVerified: '-'
      };

      setSearchedNode(nodeInfo);
      setLoading(false);
    } catch (err: any) {
      console.error('Error searching node:', err);
      setError('Failed to search for node');
      setLoading(false);
    }
  };

  const handleUnstake = async () => {
    if (!address || !signer) {
      setError('Please connect your wallet first');
      return;
    }

    if (!confirm('Are you sure you want to cancel your node and unstake? You will receive your 0.1 BNB back.')) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Check network
      const provider = signer.provider as ethers.BrowserProvider;
      const isCorrectNetwork = await checkNetwork(provider);
      
      if (!isCorrectNetwork) {
        const switched = await switchToBSCTestnet();
        if (!switched) {
          setError('Please manually switch to BSC Testnet (Chain ID: 97) in MetaMask');
          setLoading(false);
          return;
        }
      }

      // Unstake and get BNB back
      const result = await unstakeNode(signer);

      if (result.success) {
        setError('');
        alert(`SUCCESS: Node cancelled! ${result.amount} BNB returned to your wallet. Tx: ${result.txHash}`);
        // Refresh the nodes list
        fetchMyNodes();
      } else {
        let errorMsg = result.error || 'Unstake failed';
        
        if (errorMsg.includes('Not a registered node')) {
          errorMsg = 'You do not have a registered node to unstake.';
        } else if (errorMsg.includes('user rejected') || errorMsg.includes('User denied')) {
          errorMsg = 'Transaction rejected. Please approve the transaction in MetaMask.';
        }
        
        setError(errorMsg);
      }

      setLoading(false);

    } catch (err: any) {
      console.error('Error unstaking node:', err);
      setError(err.message || 'Unstaking failed');
      setLoading(false);
    }
  };

  const NodeCard = ({ node }: { node: NodeInfo }) => (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{node.nodeId}</h3>
            <p className="text-sm text-muted-foreground break-all">{node.address}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              node.antiCheatStatus === 'Clean'
                ? 'bg-accent/10 text-accent border border-accent'
                : node.antiCheatStatus === 'Warning'
                ? 'bg-warning/10 text-warning border border-warning'
                : 'bg-destructive/10 text-destructive border border-destructive'
            }`}>
              {node.antiCheatStatus || 'Clean'}
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              node.isActive
                ? 'bg-accent/10 text-accent border border-accent'
                : 'bg-destructive/10 text-destructive border border-destructive'
            }`}>
              {node.isActive ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Server className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Node Type</p>
              <p className="text-sm font-medium text-foreground">{node.nodeType || 'BSC Full'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Shield className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Verification</p>
              <p className="text-sm font-medium text-foreground">{node.verificationMethod || 'Local Prover'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <WalletIcon className="w-4 h-4 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">Staked</p>
              <p className="text-sm font-medium text-foreground">{node.stakedAmount} BNB</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <CheckCircle className="w-4 h-4 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">Verifications</p>
              <p className="text-sm font-medium text-foreground">{node.verificationsPassed || 0}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Clock className="w-4 h-4 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">Last Verified</p>
              <p className="text-sm font-medium text-foreground">{node.lastVerified || '-'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Award className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Points</p>
              <p className="text-sm font-medium text-primary">0</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm mb-4">
            <Activity className={`w-4 h-4 ${node.isActive ? 'text-accent' : 'text-muted-foreground'}`} />
            <span className="text-muted-foreground">
              Status: {node.isActive ? 'Node is active and earning points' : 'Node is currently inactive'}
            </span>
          </div>

          {address?.toLowerCase() === node.address.toLowerCase() && (
            <Button
              onClick={handleUnstake}
              className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground flex items-center gap-2"
              disabled={loading}
              variant="destructive"
            >
              <Trash2 className="w-4 h-4" />
              {loading ? 'Cancelling...' : 'Cancel Node & Get 0.1 BNB Back'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto">
        <h1 className="text-3xl sm:text-4xl text-foreground mb-2">Node Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          View your registered nodes and search for any node on the network
        </p>

        {/* Search Section */}
        <Card className="p-6 mb-8 bg-card border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Search for a Node</h2>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter wallet address (0x...)"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full"
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={loading || !searchAddress}
              className="flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 p-3 bg-destructive/10 border border-destructive rounded-lg">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </Card>

        {/* Search Results */}
        {searchedNode && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Search Results</h2>
            <NodeCard node={searchedNode} />
          </div>
        )}

        {/* My Nodes Section */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">My Nodes</h2>
          
          {!address ? (
            <Card className="p-8 text-center bg-card border-border">
              <WalletIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Look Up a Node</h3>
              <p className="text-muted-foreground mb-4">
                Use the search above to find any registered node by its wallet address.
              </p>
            </Card>
          ) : loading ? (
            <Card className="p-8 text-center bg-card border-border">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your nodes...</p>
            </Card>
          ) : myNodes.length === 0 ? (
            <Card className="p-8 text-center bg-card border-border">
              <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Nodes Found</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any registered nodes yet
              </p>
              <Button onClick={() => window.location.href = '/register'}>
                Register a Node
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {myNodes.map((node, index) => (
                <NodeCard key={index} node={node} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

