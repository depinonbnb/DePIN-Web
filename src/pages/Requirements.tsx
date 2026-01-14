import { Card } from '../components/ui/card';
import { Cpu, HardDrive, Wifi, Monitor, Download, ExternalLink, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

export function Requirements() {
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">System Requirements</h1>
          <p className="text-muted-foreground">
            Everything you need to know to run a BNB DePIN node and contribute to the network.
          </p>
        </div>

        {/* Node Types */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* BSC RPC Node Requirements */}
          <Card className="bg-card border-border p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Monitor className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">BSC RPC Node</h2>
                <p className="text-sm text-muted-foreground">Lightweight node option</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Cpu className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">CPU</p>
                  <p className="text-sm text-muted-foreground">4+ cores recommended</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <HardDrive className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">RAM</p>
                  <p className="text-sm text-muted-foreground">8GB minimum (16GB recommended)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <HardDrive className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Storage</p>
                  <p className="text-sm text-muted-foreground">500GB+ SSD</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Wifi className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Internet</p>
                  <p className="text-sm text-muted-foreground">Stable, 25+ Mbps up/down</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Operating System</p>
                  <p className="text-sm text-muted-foreground">Windows, macOS, or Linux</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-accent mb-2">Perfect for:</p>
              <p className="text-sm text-muted-foreground">Home PCs, mid-range gaming PCs</p>
            </div>
          </Card>

          {/* Full BSC Node Requirements */}
          <Card className="bg-card border-border p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">BSC Full Node</h2>
                <p className="text-sm text-muted-foreground">Complete blockchain validation</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Cpu className="w-5 h-5 text-accent mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">CPU</p>
                  <p className="text-sm text-muted-foreground">8+ cores (High performance)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <HardDrive className="w-5 h-5 text-accent mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">RAM</p>
                  <p className="text-sm text-muted-foreground">16GB+ (32GB recommended)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <HardDrive className="w-5 h-5 text-accent mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Storage</p>
                  <p className="text-sm text-muted-foreground">2TB+ fast SSD (NVMe preferred)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Wifi className="w-5 h-5 text-accent mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Internet</p>
                  <p className="text-sm text-muted-foreground">Reliable, 100+ Mbps recommended</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Operating System</p>
                  <p className="text-sm text-muted-foreground">Linux preferred (Windows/macOS works)</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-accent mb-2">Perfect for:</p>
              <p className="text-sm text-muted-foreground">High-end gaming PCs, dedicated servers</p>
            </div>
          </Card>
        </div>

        {/* Getting Started */}
        <Card className="bg-card border-border p-8 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Getting Started with DePIN Node</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-bold">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">Register Your Node</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Connect your MetaMask wallet and register your node on the BNB Smart Chain testnet. 
                  You'll need to stake 0.1 BNB to activate your node.
                </p>
                <Button size="sm" asChild>
                  <a href="/register">Register Node</a>
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-bold">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">Download BSC Node Software</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Download the official BSC node software from the BNB Smart Chain GitHub repository. 
                  Follow the setup instructions to sync and run your node.
                </p>
                <Button size="sm" variant="outline" asChild>
                  <a href="https://github.com/bnb-chain/bsc" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Official BSC GitHub
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-bold">3</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">Run & Earn</h3>
                <p className="text-sm text-muted-foreground">
                  Install and run the node software. Your bandwidth contributions will be tracked automatically, 
                  and you'll earn points based on your usage. Points translate to BNB rewards from vault fees!
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* BSC Full Node Setup */}
        <Card className="bg-card border-border p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Running a BSC Full Node (Optional)</h2>
          <p className="text-muted-foreground mb-6">
            For advanced users who want to support the BNB Smart Chain network directly by running a full node. 
            This is completely optional and not required to earn DePIN rewards.
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent mt-1 shrink-0" />
              <div>
                <p className="font-medium text-foreground">What is a BSC Full Node?</p>
                <p className="text-sm text-muted-foreground">
                  A full node downloads and validates the entire BNB Smart Chain blockchain (~2TB). 
                  It helps secure the network by validating all transactions and blocks.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent mt-1 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Why Run One?</p>
                <p className="text-sm text-muted-foreground">
                  Help decentralize BSC, provide RPC endpoints for dApps, and contribute to network security. 
                  Note: This is altruistic and does not provide direct financial rewards from BSC.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Official BSC Node Setup</h3>
            <ol className="space-y-2 text-sm text-muted-foreground mb-4">
              <li>1. Install Go 1.19+ and build tools</li>
              <li>2. Clone the BSC repository</li>
              <li>3. Download genesis.json and config.toml</li>
              <li>4. Initialize and sync the blockchain</li>
              <li>5. Run the node 24/7 for full synchronization</li>
            </ol>
            <Button size="sm" variant="outline" asChild>
              <a 
                href="https://docs.bnbchain.org/docs/validator/fullnode" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                View BSC Official Documentation
                <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
          </div>

          <div className="bg-muted/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Important:</span> Running a BSC full node is resource-intensive 
              and separate from the DePIN bandwidth node. Most users only need to run the DePIN node software to earn rewards.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

