import { Card } from '../components/ui/card';
import { Server, Wifi, Database, Shield, ArrowRight, Network, Cpu, CheckCircle2 } from 'lucide-react';

export function HowItWorks() {
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">How DePIN Works</h1>
          <p className="text-muted-foreground text-lg">
            Understanding the technology behind decentralized physical infrastructure on BNB Smart Chain
          </p>
        </div>

        {/* What is DePIN */}
        <Card className="bg-card border-border p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Network className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">What is DePIN?</h2>
          </div>
          <div className="space-y-4 text-muted-foreground">
            <p>
              DePIN stands for Decentralized Physical Infrastructure Network. It's a revolutionary approach to building 
              and maintaining physical infrastructure using blockchain technology and distributed computing.
            </p>
            <p>
              Instead of relying on centralized corporations to provide infrastructure services, DePIN networks allow 
              individuals to contribute their computing resources (bandwidth, storage, processing power) and earn rewards 
              for their contributions.
            </p>
          </div>
        </Card>

        {/* How DePIN on BNB Works - Flow Diagram */}
        <Card className="bg-card border-border p-8 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">How It Works: Step by Step</h2>
          
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-bold text-lg">1</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Server className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-semibold text-foreground">Host a Node on Your PC</h3>
                </div>
                <p className="text-muted-foreground mb-3">
                  You install the DePIN node software on your home PC or server. This lightweight application runs 
                  in the background and shares your unused bandwidth with the network. Your computer becomes a node 
                  in the decentralized infrastructure.
                </p>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Your PC's Role:</span> Acts as a relay point 
                    for network traffic, helping to distribute data across the decentralized network.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="w-6 h-6 text-primary" />
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-bold text-lg">2</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Wifi className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-semibold text-foreground">Contribute Bandwidth</h3>
                </div>
                <p className="text-muted-foreground mb-3">
                  As your node runs, it shares bandwidth with other users in the network. The node software automatically 
                  tracks how much bandwidth you contribute and for how long your node has been active. All contributions 
                  are measured and verified to ensure accuracy.
                </p>
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Bandwidth Tracking:</span> Our system uses secure, 
                    cryptographically signed reports with 7 layers of security to prevent fraud and ensure honest reporting.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="w-6 h-6 text-primary" />
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-bold text-lg">3</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Database className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-semibold text-foreground">Earn Points on BSC</h3>
                </div>
                <p className="text-muted-foreground mb-3">
                  Your bandwidth contributions are converted into points that are tracked on the BNB Smart Chain blockchain. 
                  The more bandwidth you share and the longer you run your node, the more points you accumulate. These 
                  points are stored immutably on-chain in our smart contracts.
                </p>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Blockchain Integration:</span> All point allocations 
                    are recorded on BSC, ensuring transparency and preventing tampering. Anyone can verify your contributions.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="w-6 h-6 text-primary" />
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-bold text-lg">4</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-semibold text-foreground">Earn Rewards from Vault</h3>
                </div>
                <p className="text-muted-foreground mb-3">
                  The vault collects fees from BSC token transactions. These fees are distributed proportionally to all 
                  node operators based on their accumulated points. The more points you have, the larger your share of 
                  the vault rewards. You can claim your BNB rewards at any time.
                </p>
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Fair Distribution:</span> Points = Your share. 
                    If you have 1% of all network points, you receive 1% of the vault fees. Simple and transparent.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Blockchain Synchronization */}
        <Card className="bg-card border-border p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">How DePIN Syncs with BSC Blockchain</h2>
          </div>
          
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Our DePIN network is deeply integrated with the BNB Smart Chain blockchain to ensure transparency, 
              security, and trustless operation. Here's how the synchronization works:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  <h3 className="font-semibold text-foreground">Smart Contract Registry</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-7">
                  When you register a node, your wallet address and node ID are recorded in our staking smart contract 
                  on BSC. This creates an immutable, on-chain record of your node.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  <h3 className="font-semibold text-foreground">Point Allocation</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-7">
                  Verified bandwidth contributions are converted to points and written to our points smart contract. 
                  Each transaction is recorded on BSC and can be viewed on BSCScan.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  <h3 className="font-semibold text-foreground">Vault Distribution</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-7">
                  The vault smart contract holds BNB collected from fees. When you claim rewards, the contract 
                  calculates your share based on your points and sends BNB directly to your wallet.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  <h3 className="font-semibold text-foreground">Real-Time Updates</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-7">
                  Your dashboard queries the blockchain directly to show your current points, rewards, and node status. 
                  Everything is sourced from on-chain data, ensuring accuracy.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Why DePIN on BNB Chain */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Why BNB Smart Chain?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">~3s</div>
              <p className="text-sm font-semibold text-foreground">Block Time</p>
              <p className="text-xs text-muted-foreground">
                Fast transaction confirmation for near-instant point updates and reward claims.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">$0.10</div>
              <p className="text-sm font-semibold text-foreground">Avg Gas Fee</p>
              <p className="text-xs text-muted-foreground">
                Low transaction costs make it economical to claim rewards and update on-chain data frequently.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">500M+</div>
              <p className="text-sm font-semibold text-foreground">Users</p>
              <p className="text-xs text-muted-foreground">
                Massive ecosystem of users and dApps that can utilize the DePIN infrastructure.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

