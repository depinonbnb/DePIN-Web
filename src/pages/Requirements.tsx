import { Card } from '../components/ui/card';
import { Cpu, HardDrive, Wifi, Monitor, Download, ExternalLink, Server, Database } from 'lucide-react';
import { Button } from '../components/ui/button';

export function Requirements() {
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">System Requirements</h1>
          <p className="text-muted-foreground">
            Hardware requirements for running BNB Chain nodes. Choose a node type based on your available resources.
          </p>
        </div>

        {/* BSC Node Types */}
        <h2 className="text-2xl font-bold text-foreground mb-4">BSC Node Types</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* BSC Archive Node */}
          <Card className="bg-card border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">BSC Archive</h3>
                <p className="text-xs text-primary">Highest Rewards</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Full historical state data. Can answer queries about any block in history.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                <span className="text-foreground">8+ cores (high performance)</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-primary" />
                <span className="text-foreground">32GB+ RAM</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-primary" />
                <span className="text-foreground">4TB+ NVMe SSD</span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-primary" />
                <span className="text-foreground">100+ Mbps</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Registration</span>
                <span className="text-primary font-bold">100 pts</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Uptime</span>
                <span className="text-primary font-bold">10 pts/hr</span>
              </div>
            </div>
          </Card>

          {/* BSC Full Node */}
          <Card className="bg-card border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Server className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">BSC Full</h3>
                <p className="text-xs text-muted-foreground">Standard Option</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Complete blockchain validation. Validates all transactions and blocks.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                <span className="text-foreground">8+ cores</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-primary" />
                <span className="text-foreground">16GB+ RAM (32GB recommended)</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-primary" />
                <span className="text-foreground">2TB+ SSD</span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-primary" />
                <span className="text-foreground">100+ Mbps</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Registration</span>
                <span className="text-primary font-bold">50 pts</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Uptime</span>
                <span className="text-primary font-bold">6 pts/hr</span>
              </div>
            </div>
          </Card>

          {/* BSC Fast Node */}
          <Card className="bg-card border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Monitor className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">BSC Fast</h3>
                <p className="text-xs text-muted-foreground">Entry Level</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Lightweight node. Lower resource requirements, basic verifications only.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                <span className="text-foreground">4+ cores</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-primary" />
                <span className="text-foreground">8GB+ RAM (16GB recommended)</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-primary" />
                <span className="text-foreground">500GB+ SSD</span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-primary" />
                <span className="text-foreground">25+ Mbps</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Registration</span>
                <span className="text-primary font-bold">40 pts</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Uptime</span>
                <span className="text-primary font-bold">4 pts/hr</span>
              </div>
            </div>
          </Card>
        </div>

        {/* opBNB Node Types */}
        <h2 className="text-2xl font-bold text-foreground mb-4">opBNB Node Types (Layer 2)</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* opBNB Full Node */}
          <Card className="bg-card border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Server className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">opBNB Full</h3>
                <p className="text-xs text-muted-foreground">L2 Full Node</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Complete opBNB Layer 2 validation. Lower requirements than BSC L1.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-accent" />
                <span className="text-foreground">4+ cores</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-accent" />
                <span className="text-foreground">16GB+ RAM</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-accent" />
                <span className="text-foreground">1TB+ SSD</span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-accent" />
                <span className="text-foreground">50+ Mbps</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Registration</span>
                <span className="text-accent font-bold">40 pts</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Uptime</span>
                <span className="text-accent font-bold">4 pts/hr</span>
              </div>
            </div>
          </Card>

          {/* opBNB Fast Node */}
          <Card className="bg-card border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Monitor className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">opBNB Fast</h3>
                <p className="text-xs text-muted-foreground">L2 Entry Level</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Lightweight L2 node. Easiest entry point for opBNB participation.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-accent" />
                <span className="text-foreground">4+ cores</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-accent" />
                <span className="text-foreground">8GB+ RAM</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-accent" />
                <span className="text-foreground">500GB+ SSD</span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-accent" />
                <span className="text-foreground">25+ Mbps</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Registration</span>
                <span className="text-accent font-bold">30 pts</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Uptime</span>
                <span className="text-accent font-bold">3 pts/hr</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Verification Types */}
        <Card className="bg-card border-border p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Verification Types by Node</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Node Type</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Block Hash</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Block Data</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">State Balance</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Sync Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 text-foreground">BSC Archive</td>
                  <td className="py-3 px-4 text-center text-accent">Yes</td>
                  <td className="py-3 px-4 text-center text-accent">Yes</td>
                  <td className="py-3 px-4 text-center text-accent">Yes</td>
                  <td className="py-3 px-4 text-center text-accent">Yes</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 text-foreground">BSC Full</td>
                  <td className="py-3 px-4 text-center text-accent">Yes</td>
                  <td className="py-3 px-4 text-center text-accent">Yes</td>
                  <td className="py-3 px-4 text-center text-muted-foreground">No</td>
                  <td className="py-3 px-4 text-center text-accent">Yes</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 text-foreground">BSC Fast</td>
                  <td className="py-3 px-4 text-center text-accent">Yes</td>
                  <td className="py-3 px-4 text-center text-muted-foreground">No</td>
                  <td className="py-3 px-4 text-center text-muted-foreground">No</td>
                  <td className="py-3 px-4 text-center text-accent">Yes</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 text-foreground">opBNB Full</td>
                  <td className="py-3 px-4 text-center text-accent">Yes</td>
                  <td className="py-3 px-4 text-center text-accent">Yes</td>
                  <td className="py-3 px-4 text-center text-muted-foreground">No</td>
                  <td className="py-3 px-4 text-center text-accent">Yes</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-foreground">opBNB Fast</td>
                  <td className="py-3 px-4 text-center text-accent">Yes</td>
                  <td className="py-3 px-4 text-center text-muted-foreground">No</td>
                  <td className="py-3 px-4 text-center text-muted-foreground">No</td>
                  <td className="py-3 px-4 text-center text-accent">Yes</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Archive nodes receive harder verifications (historical state queries) but earn higher rewards.
          </p>
        </Card>

        {/* Getting Started */}
        <Card className="bg-card border-border p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Getting Started</h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-bold">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">Set Up Your Node</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Download and run BSC or opBNB node software. Wait for full sync before registering.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href="https://github.com/bnb-chain/bsc" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      BSC Node
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href="https://github.com/bnb-chain/opbnb" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      opBNB Node
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-bold">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">Register Your Node</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Connect your wallet and register your node type. Sign the registration message to prove ownership.
                </p>
                <Button size="sm" asChild>
                  <a href="/register">Register Node</a>
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-bold">3</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">Download & Run Prover CLI</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Install the prover software and configure it with your node's RPC endpoint. It handles verifications automatically.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" disabled>
                    <Download className="w-4 h-4 mr-2" />
                    Windows (Coming Soon)
                  </Button>
                  <Button size="sm" variant="outline" disabled>
                    <Download className="w-4 h-4 mr-2" />
                    macOS (Coming Soon)
                  </Button>
                  <Button size="sm" variant="outline" disabled>
                    <Download className="w-4 h-4 mr-2" />
                    Linux (Coming Soon)
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-bold">4</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">Prove & Earn</h3>
                <p className="text-sm text-muted-foreground">
                  Your prover runs in the background, answering verification requests every 5 minutes.
                  Earn points for successful verifications and uptime. Track your progress on the dashboard.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Tips */}
        <Card className="bg-primary/5 border-primary/20 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">Tips for Maximum Points</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">1.</span>
              <span>Run the highest tier node your hardware supports - Archive nodes earn 2.5x more than Fast nodes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">2.</span>
              <span>Maintain high uptime - Points accumulate hourly, so 24/7 operation maximizes earnings</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">3.</span>
              <span>Keep response latency low - Fast responses (under 150ms) ensure all verifications pass</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">4.</span>
              <span>Use NVMe SSDs - Faster storage means faster query responses and better verification rates</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
