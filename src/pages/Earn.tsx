import { useEffect, useState } from 'react';
import { Card } from '../components/ui/card';
import { Wallet, TrendingUp, DollarSign, Clock, Award } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useWallet } from '../lib/wallet';

interface VaultStats {
  totalBalance: string;
  feesCollected: string;
  userBalance: string;
  userEarnings: string;
  userPoints: string;
  lastUpdate: string;
}

export function Earn() {
  const { address } = useWallet();
  const [vaultStats, setVaultStats] = useState<VaultStats>({
    totalBalance: '0',
    feesCollected: '0',
    userBalance: '0',
    userEarnings: '0',
    userPoints: '0',
    lastUpdate: new Date().toISOString(),
  });

  useEffect(() => {
    fetchVaultStats();
    const interval = setInterval(fetchVaultStats, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [address]);

  const fetchVaultStats = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`http://localhost:3001/api/vault/stats${address ? `?address=${address}` : ''}`);
      // const data = await response.json();
      
      // Mock data for now
      setVaultStats({
        totalBalance: '1,234.56',
        feesCollected: '45.78',
        userBalance: address ? '12.34' : '0',
        userEarnings: address ? '2.15' : '0',
        userPoints: address ? '15,420' : '0',
        lastUpdate: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching vault stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Earn</h1>
          <p className="text-muted-foreground">
            Earn rewards by hosting nodes. The vault collects fees from BSC token transactions and distributes them to node operators based on their points earned from bandwidth contribution.
          </p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Vault Balance */}
          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Total Vault</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-foreground">{vaultStats.totalBalance}</p>
              <p className="text-sm text-muted-foreground">BNB</p>
            </div>
          </Card>

          {/* Total Fees Collected */}
          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <span className="text-xs text-muted-foreground">Fees Collected</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-foreground">{vaultStats.feesCollected}</p>
              <p className="text-sm text-muted-foreground">BNB</p>
            </div>
          </Card>

          {/* Your Points */}
          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Your Points</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-primary">{address ? vaultStats.userPoints : '0'}</p>
              <p className="text-sm text-muted-foreground">Total Earned</p>
            </div>
          </Card>

          {/* Last Update */}
          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-muted/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground">Last Updated</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {new Date(vaultStats.lastUpdate).toLocaleTimeString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(vaultStats.lastUpdate).toLocaleDateString()}
              </p>
            </div>
          </Card>
        </div>

        {/* User Earnings Section */}
        {address ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Node Stake</h3>
                  <p className="text-muted-foreground">BNB staked for node</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold text-primary">{vaultStats.userBalance} BNB</p>
                <p className="text-sm text-muted-foreground">
                  ≈ ${(parseFloat(vaultStats.userBalance.replace(',', '')) * 600).toFixed(2)} USD
                </p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Your Earnings</h3>
                  <p className="text-muted-foreground">From vault fees</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold text-accent">{vaultStats.userEarnings} BNB</p>
                <p className="text-sm text-muted-foreground">
                  ≈ ${(parseFloat(vaultStats.userEarnings.replace(',', '')) * 600).toFixed(2)} USD
                </p>
              </div>
              <div className="mt-6">
                <Button className="w-full" size="lg">
                  Claim Rewards
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <Card className="bg-card border-border p-12 text-center mb-8">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Connect Your Wallet</h3>
              <p className="text-muted-foreground mb-6">
                Connect your wallet to view your points, track your earnings from vault fees, and claim rewards.
              </p>
            </div>
          </Card>
        )}

        {/* How It Works */}
        <Card className="bg-card border-border p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">How Points & Vault Earnings Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">Host Node & Earn Points</h3>
              <p className="text-sm text-muted-foreground">
                Run a node and earn points based on how much bandwidth you contribute and how long you run the node.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">Vault Collects Fees</h3>
              <p className="text-sm text-muted-foreground">
                The vault automatically collects fees from BSC token transactions on the network.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">Earn Based on Points</h3>
              <p className="text-sm text-muted-foreground">
                Vault fees are distributed proportionally among all node hosters based on their total points earned.
              </p>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-2">Points = Your Share</h3>
            <p className="text-sm text-muted-foreground">
              The more points you have, the larger your share of the vault fees. Points are earned by contributing bandwidth over time. 
              More bandwidth + Longer duration = More points = Higher rewards!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

