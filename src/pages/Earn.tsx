import { useEffect, useState } from 'react';
import { Card } from '../components/ui/card';
import { Wallet, TrendingUp, Clock, Award, CheckCircle, Server } from 'lucide-react';
import { useWallet } from '../lib/wallet';

interface UserStats {
  totalPoints: string;
  verificationsPassed: string;
  uptimeHours: string;
  nodeType: string;
  registrationBonus: string;
  lastUpdate: string;
}

export function Earn() {
  const { address } = useWallet();
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: '0',
    verificationsPassed: '0',
    uptimeHours: '0',
    nodeType: '-',
    registrationBonus: '0',
    lastUpdate: new Date().toISOString(),
  });

  useEffect(() => {
    fetchUserStats();
    const interval = setInterval(fetchUserStats, 30000);
    return () => clearInterval(interval);
  }, [address]);

  const fetchUserStats = async () => {
    try {
      // TODO: Replace with actual API call
      // Mock data for now
      setUserStats({
        totalPoints: address ? '15,420' : '0',
        verificationsPassed: address ? '2,847' : '0',
        uptimeHours: address ? '1,248' : '0',
        nodeType: address ? 'BSC Full' : '-',
        registrationBonus: address ? '50' : '0',
        lastUpdate: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Earn</h1>
          <p className="text-muted-foreground">
            Earn points by proving you run real BNB nodes through automatic verification. Points are awarded for registration, uptime, and successful verifications.
          </p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Points */}
          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Your Points</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-primary">{address ? userStats.totalPoints : '0'}</p>
              <p className="text-sm text-muted-foreground">Total Earned</p>
            </div>
          </Card>

          {/* Verifications Passed */}
          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-accent" />
              </div>
              <span className="text-xs text-muted-foreground">Verifications</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-foreground">{address ? userStats.verificationsPassed : '0'}</p>
              <p className="text-sm text-muted-foreground">Passed</p>
            </div>
          </Card>

          {/* Uptime Hours */}
          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Uptime</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-foreground">{address ? userStats.uptimeHours : '0'}</p>
              <p className="text-sm text-muted-foreground">Hours</p>
            </div>
          </Card>

          {/* Node Type */}
          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-muted/10 flex items-center justify-center">
                <Server className="w-6 h-6 text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground">Node Type</span>
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold text-foreground">{userStats.nodeType}</p>
              <p className="text-sm text-muted-foreground">
                +{userStats.registrationBonus} pts bonus
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
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Points Breakdown</h3>
                  <p className="text-muted-foreground">How you earned your points</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Registration Bonus</span>
                  <span className="text-foreground font-medium">+{userStats.registrationBonus} pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Uptime ({userStats.uptimeHours} hrs x 6 pts/hr)</span>
                  <span className="text-foreground font-medium">+{(parseInt(userStats.uptimeHours.replace(',', '')) * 6).toLocaleString()} pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Verifications Passed</span>
                  <span className="text-foreground font-medium">+{userStats.verificationsPassed} pts</span>
                </div>
                <div className="border-t border-border pt-4 flex justify-between items-center">
                  <span className="text-foreground font-semibold">Total Points</span>
                  <span className="text-primary font-bold text-xl">{userStats.totalPoints}</span>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                  <Award className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Points Rate</h3>
                  <p className="text-muted-foreground">Based on your node type</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-card/50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">Your Node Type</div>
                  <div className="text-xl font-bold text-foreground">{userStats.nodeType}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card/50 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">Uptime Rate</div>
                    <div className="text-lg font-bold text-accent">6 pts/hr</div>
                  </div>
                  <div className="bg-card/50 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">Per Verification</div>
                    <div className="text-lg font-bold text-accent">1 pt</div>
                  </div>
                </div>
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
                Connect your wallet to view your points, track your verifications, and see your node performance.
              </p>
            </div>
          </Card>
        )}

        {/* Points System */}
        <Card className="bg-card border-border p-8 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Points System</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Registration Bonus */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Registration Bonus (One-Time)</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-foreground">BSC Archive</span>
                  <span className="text-primary font-bold">100 pts</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-foreground">BSC Full</span>
                  <span className="text-primary font-bold">50 pts</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-foreground">BSC Fast</span>
                  <span className="text-primary font-bold">40 pts</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-foreground">opBNB Full</span>
                  <span className="text-accent font-bold">40 pts</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-foreground">opBNB Fast</span>
                  <span className="text-accent font-bold">30 pts</span>
                </div>
              </div>
            </div>

            {/* Uptime Points */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Uptime Points (Per Hour)</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-foreground">BSC Archive</span>
                  <span className="text-primary font-bold">10 pts/hr</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-foreground">BSC Full</span>
                  <span className="text-primary font-bold">6 pts/hr</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-foreground">BSC Fast</span>
                  <span className="text-primary font-bold">4 pts/hr</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-foreground">opBNB Full</span>
                  <span className="text-accent font-bold">4 pts/hr</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-foreground">opBNB Fast</span>
                  <span className="text-accent font-bold">3 pts/hr</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* How It Works */}
        <Card className="bg-card border-border p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">How to Earn Points</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">Run a BNB Node</h3>
              <p className="text-sm text-muted-foreground">
                Set up and run a BSC or opBNB node. Choose from Archive, Full, or Fast based on your hardware.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">Pass Verifications</h3>
              <p className="text-sm text-muted-foreground">
                Your prover automatically answers verification queries. Fast, correct responses earn you points.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">Accumulate Points</h3>
              <p className="text-sm text-muted-foreground">
                Points grow from registration bonus + uptime hours + successful verifications. Higher tier nodes = more points.
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-2">Points = Your Contribution</h3>
            <p className="text-sm text-muted-foreground">
              Points represent your contribution to the BNB Chain infrastructure. The more you contribute (better node type + longer uptime + more verifications), the more points you earn. Archive nodes earn the most because they require the most resources.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
