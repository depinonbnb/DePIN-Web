import { Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Server,
  Shield,
  Database,
  CheckCircle2,
  ArrowRight,
  Cpu,
  HardDrive,
  Wifi,
  Clock,
  AlertTriangle,
  Coins,
  Zap,
  Wallet,
  Calendar,
  Workflow,
  TrendingUp,
} from 'lucide-react';

interface NodeSpec {
  id: string;
  name: string;
  tier: string;
  tone: 'primary' | 'accent' | 'muted';
  description: string;
  cpu: string;
  ram: string;
  storage: string;
  network: string;
  syncTime: string;
  regPoints: number;
  uptimePointsPerHour: number;
}

const NODE_SPECS: NodeSpec[] = [
  {
    id: 'bsc-archive',
    name: 'BSC Archive',
    tier: 'Highest reward',
    tone: 'primary',
    description: 'Full historical state. Can answer queries about any block in BSC history.',
    cpu: '8+ cores',
    ram: '32 GB+',
    storage: '4 TB+ NVMe',
    network: '100+ Mbps',
    syncTime: '24–48 hrs',
    regPoints: 100,
    uptimePointsPerHour: 10,
  },
  {
    id: 'bsc-full',
    name: 'BSC Full',
    tier: 'High reward',
    tone: 'primary',
    description: 'Complete BNB Smart Chain validation. The standard recommended starting point.',
    cpu: '4+ cores',
    ram: '16 GB+',
    storage: '2 TB+ NVMe',
    network: '50+ Mbps',
    syncTime: '8–16 hrs',
    regPoints: 50,
    uptimePointsPerHour: 6,
  },
  {
    id: 'bsc-fast',
    name: 'BSC Fast',
    tier: 'Medium reward',
    tone: 'muted',
    description: 'Lightweight trimmed node. Lower hardware bar, lower rewards.',
    cpu: '2+ cores',
    ram: '8 GB+',
    storage: '500 GB+ SSD',
    network: '25+ Mbps',
    syncTime: '4–8 hrs',
    regPoints: 40,
    uptimePointsPerHour: 4,
  },
  {
    id: 'opbnb-full',
    name: 'opBNB Full',
    tier: 'Medium reward',
    tone: 'accent',
    description: 'Layer-2 full node on opBNB. Complete L2 validation.',
    cpu: '4+ cores',
    ram: '16 GB+',
    storage: '1 TB+ NVMe',
    network: '50+ Mbps',
    syncTime: '6–12 hrs',
    regPoints: 40,
    uptimePointsPerHour: 4,
  },
  {
    id: 'opbnb-fast',
    name: 'opBNB Fast',
    tier: 'Entry level',
    tone: 'accent',
    description: 'Trimmed L2 node. Lowest-friction entry point to running opBNB.',
    cpu: '2+ cores',
    ram: '8 GB+',
    storage: '500 GB+ SSD',
    network: '25+ Mbps',
    syncTime: '3–6 hrs',
    regPoints: 30,
    uptimePointsPerHour: 3,
  },
];

const TOC_SECTIONS = [
  { id: 'overview', label: 'How it works' },
  { id: 'nodes', label: 'Pick a node' },
  { id: 'hardware', label: 'Hardware specs' },
  { id: 'earnings', label: 'Earnings' },
  { id: 'timeline', label: 'Setup time' },
  { id: 'anti-cheat', label: 'Anti-cheat' },
];

function toneClasses(tone: NodeSpec['tone']) {
  switch (tone) {
    case 'primary':
      return { text: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30' };
    case 'accent':
      return { text: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/30' };
    default:
      return { text: 'text-foreground', bg: 'bg-muted', border: 'border-border' };
  }
}

function tierBadgeClasses(tier: string): string {
  const label = tier.toLowerCase();
  if (label.includes('highest')) {
    return 'border-primary/40 bg-primary/15 text-primary';
  }
  if (label.includes('high')) {
    return 'border-primary/30 bg-primary/10 text-primary';
  }
  if (label.includes('medium')) {
    return 'border-border bg-muted text-muted-foreground';
  }
  return 'border-border bg-background text-muted-foreground';
}

function RewardTierBadge({ tier }: { tier: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-xs font-medium leading-none whitespace-nowrap ${tierBadgeClasses(tier)}`}
    >
      {tier}
    </span>
  );
}

export function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      {/* hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(217,165,10,0.18),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4">Operator Guide</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
              Run a BNB node.
              <br />
              <span className="text-primary">Earn rewards.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Everything you need to set up, register, and start earning — from hardware specs to the first payout cycle.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href="#overview">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Read the guide
                </Button>
              </a>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                ~5 min registration
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                5 node types supported
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                Weekly reward cycles
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 px-3">On this page</p>
              {TOC_SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  {s.label}
                </a>
              ))}
              <div className="pt-4">
                <Link to="/register">
                  <Button size="sm" className="w-full">
                    Register a Node
                  </Button>
                </Link>
              </div>
            </div>
          </aside>

          
          <main className="space-y-16">
            
            <section id="overview" className="scroll-mt-24">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">How it works</h2>
              <p className="text-muted-foreground mb-8">
                Four steps from a synced node to your first payout cycle.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <FlowStep
                  step={1}
                  icon={<Server className="w-5 h-5 text-primary" />}
                  title="Sync a BNB node"
                  body="Run a BSC or opBNB node on your hardware. The official binaries from bnb-chain/bsc handle the chain — we don't ship our own client."
                />
                <FlowStep
                  step={2}
                  icon={<Wallet className="w-5 h-5 text-primary" />}
                  title="Register with your wallet"
                  body="Sign an EIP-191 message with MetaMask, stake 0.1 BNB on-chain, and tell us your node type. Five minutes."
                />
                <FlowStep
                  step={3}
                  icon={<Shield className="w-5 h-5 text-primary" />}
                  title="Pass random challenges"
                  body="We periodically ask 'what's the hash of block X?' Only a real synced node can answer fast enough. Each correct fast reply earns points."
                />
                <FlowStep
                  step={4}
                  icon={<Coins className="w-5 h-5 text-primary" />}
                  title="Claim your rewards"
                  body="Every week we publish a Merkle snapshot of points per wallet. Submit your proof to the on-chain Distributor to claim BNB."
                />
              </div>

              <Card className="bg-muted/50 border-border p-5 mt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Heads up:</span> the on-chain Distributor contract for step 4 is in a separate
                    repo and isn't deployed yet. Points accrue and snapshots get published from day one, but BNB claims will open once the
                    contract goes live.
                  </div>
                </div>
              </Card>
            </section>

            
            <section id="nodes" className="scroll-mt-24">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Pick a node</h2>
              <p className="text-muted-foreground mb-8">
                Five node types. Heavier nodes earn more per hour but need more hardware and longer sync time.
              </p>

              <Card className="bg-card border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-left">
                      <tr>
                        <th className="py-3 px-4 font-medium text-muted-foreground">Node</th>
                        <th className="py-3 px-4 font-medium text-muted-foreground">Reward tier</th>
                        <th className="py-3 px-4 font-medium text-muted-foreground">Storage</th>
                        <th className="py-3 px-4 font-medium text-muted-foreground">RAM</th>
                        <th className="py-3 px-4 font-medium text-muted-foreground">Sync</th>
                        <th className="py-3 px-4 font-medium text-muted-foreground text-right">Pts/hr</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {NODE_SPECS.map((n) => (
                          <tr key={n.id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-4 px-4">
                              <div className="font-medium text-foreground">{n.name}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">{n.description}</div>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <RewardTierBadge tier={n.tier} />
                            </td>
                            <td className="py-4 px-4 text-foreground">{n.storage}</td>
                            <td className="py-4 px-4 text-foreground">{n.ram}</td>
                            <td className="py-4 px-4 text-foreground">{n.syncTime}</td>
                            <td className="py-4 px-4 text-right">
                              <span className="font-bold text-primary">{n.uptimePointsPerHour}</span>
                              <span className="text-xs text-muted-foreground ml-1">pts</span>
                            </td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <p className="text-xs text-muted-foreground mt-3">
                Plus a one-time bonus on registration: 30–100 points depending on node type.
              </p>
            </section>

            
            <section id="hardware" className="scroll-mt-24">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Hardware specs</h2>
              <p className="text-muted-foreground mb-8">
                Minimum recommended specs per node type. Going below these will cause slow challenge responses and warnings.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {NODE_SPECS.map((n) => {
                  const tc = toneClasses(n.tone);
                  return (
                    <Card key={n.id} className={`bg-card border ${tc.border} p-5 hover:translate-y-[-2px] transition-transform`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-9 h-9 rounded-lg ${tc.bg} flex items-center justify-center`}>
                          {n.tone === 'accent' ? <Database className={`w-4 h-4 ${tc.text}`} /> : <Server className={`w-4 h-4 ${tc.text}`} />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-foreground leading-tight">{n.name}</h3>
                          <div className="mt-1.5">
                            <RewardTierBadge tier={n.tier} />
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mb-4 min-h-[36px]">{n.description}</p>

                      <dl className="space-y-2 text-sm">
                        <SpecRow icon={<Cpu className="w-3.5 h-3.5" />} label="CPU" value={n.cpu} />
                        <SpecRow icon={<HardDrive className="w-3.5 h-3.5" />} label="RAM" value={n.ram} />
                        <SpecRow icon={<Database className="w-3.5 h-3.5" />} label="Storage" value={n.storage} />
                        <SpecRow icon={<Wifi className="w-3.5 h-3.5" />} label="Network" value={n.network} />
                      </dl>

                      <div className="mt-4 pt-3 border-t border-border flex justify-between text-xs">
                        <div>
                          <div className="text-muted-foreground">Registration</div>
                          <div className="font-bold text-foreground">{n.regPoints} pts</div>
                        </div>
                        <div className="text-right">
                          <div className="text-muted-foreground">Uptime</div>
                          <div className="font-bold text-primary">{n.uptimePointsPerHour} pts/hr</div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>

            
            <section id="earnings" className="scroll-mt-24">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Earnings projection</h2>
              <p className="text-muted-foreground mb-8">
                Points accrue continuously for online time plus successful verifications. Here's what a full week at 100% uptime looks like.
              </p>

              <Card className="bg-card border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-left">
                      <tr>
                        <th className="py-3 px-4 font-medium text-muted-foreground">Node</th>
                        <th className="py-3 px-4 font-medium text-muted-foreground text-right">Per hour</th>
                        <th className="py-3 px-4 font-medium text-muted-foreground text-right">Per day</th>
                        <th className="py-3 px-4 font-medium text-muted-foreground text-right">Per week</th>
                        <th className="py-3 px-4 font-medium text-muted-foreground text-right">Per 30 days</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {NODE_SPECS.map((n) => (
                        <tr key={n.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4 font-medium text-foreground">{n.name}</td>
                          <td className="py-3 px-4 text-right text-foreground">{n.uptimePointsPerHour}</td>
                          <td className="py-3 px-4 text-right text-foreground">{(n.uptimePointsPerHour * 24).toLocaleString()}</td>
                          <td className="py-3 px-4 text-right text-foreground">{(n.uptimePointsPerHour * 24 * 7).toLocaleString()}</td>
                          <td className="py-3 px-4 text-right font-bold text-primary">
                            {(n.uptimePointsPerHour * 24 * 30).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <div className="grid gap-4 sm:grid-cols-2 mt-6">
                <Card className="bg-card border-border p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-foreground">How points convert to BNB</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Every week the backend publishes a Merkle snapshot mapping each wallet to a BNB amount derived from their accrued points.
                    You claim by submitting your proof to the on-chain Distributor contract. The conversion ratio is governance-controlled.
                  </p>
                </Card>
                <Card className="bg-card border-border p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-foreground">Boost: pass challenges</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The table above shows uptime points only. Successful challenge responses earn additional points on top. Faster local
                    responses (under 100ms) get the full bonus; slower responses (150–300ms) get warned.
                  </p>
                </Card>
              </div>
            </section>

            
            <section id="timeline" className="scroll-mt-24">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Setup timeline</h2>
              <p className="text-muted-foreground mb-8">
                Realistic time-to-first-reward, end to end.
              </p>

              <div className="space-y-3">
                <TimelineRow
                  icon={<Workflow className="w-4 h-4" />}
                  step="1. Hardware ready"
                  duration="Varies"
                  detail="If you already have a 16+ GB box with a fast SSD, you're set. Otherwise budget shopping/setup time."
                />
                <TimelineRow
                  icon={<Database className="w-4 h-4" />}
                  step="2. Sync the chain"
                  duration="3–48 hours"
                  detail="Fastest with opBNB Fast (~3–6 hrs); slowest with BSC Archive (~24–48 hrs). One-time cost — runs unattended."
                />
                <TimelineRow
                  icon={<Wallet className="w-4 h-4" />}
                  step="3. Register"
                  duration="~5 minutes"
                  detail="Connect MetaMask, stake 0.1 BNB on-chain, sign the EIP-191 message, pick verification method."
                />
                <TimelineRow
                  icon={<Shield className="w-4 h-4" />}
                  step="4. First challenge"
                  duration="< 5 minutes"
                  detail="Server begins probing your node almost immediately. Points start accruing on the first successful response."
                />
                <TimelineRow
                  icon={<Calendar className="w-4 h-4" />}
                  step="5. First snapshot cycle"
                  duration="Up to 7 days"
                  detail="Default snapshot cadence is weekly. Your accrued points appear in the next published snapshot."
                  isLast
                />
              </div>

              <Card className="bg-primary/5 border border-primary/20 p-5 mt-6">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Realistic best case:</span> if you already have hardware and pick a light
                  node (opBNB Fast), you can be fully earning points within a single afternoon.
                </p>
              </Card>
            </section>

            
            <section id="anti-cheat" className="scroll-mt-24">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Anti-cheat</h2>
              <p className="text-muted-foreground mb-8">
                What gets you flagged. Protocol designed to reward real nodes, not proxied public RPCs.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-card border-border p-5">
                  <Clock className="w-5 h-5 text-primary mb-2" />
                  <h3 className="font-semibold text-foreground mb-2">Latency thresholds</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Real local nodes answer in ~50–100 ms. Public RPC proxies take 200–500 ms. Consistently slow responses raise warnings.
                  </p>
                  <ul className="text-xs space-y-1">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">&lt; 100 ms</span>
                      <span className="text-accent">Healthy</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">100–150 ms</span>
                      <span className="text-warning">Warn</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">150–300 ms</span>
                      <span className="text-destructive">Flag for review</span>
                    </li>
                  </ul>
                </Card>

                <Card className="bg-card border-border p-5">
                  <Shield className="w-5 h-5 text-primary mb-2" />
                  <h3 className="font-semibold text-foreground mb-2">Signed responses</h3>
                  <p className="text-sm text-muted-foreground">
                    Every challenge response is signed with your wallet's private key. Anti-replay nonces (10-min TTL) mean a captured
                    signature can't be reused. You can't share challenges across multiple wallets.
                  </p>
                </Card>

                <Card className="bg-card border-border p-5">
                  <AlertTriangle className="w-5 h-5 text-primary mb-2" />
                  <h3 className="font-semibold text-foreground mb-2">Review &amp; bans</h3>
                  <p className="text-sm text-muted-foreground">
                    Warnings accumulate. 5+ warnings flag your node for admin review. Confirmed cheating results in a ban — banned nodes
                    earn nothing and are excluded from reward snapshots.
                  </p>
                </Card>
              </div>
            </section>

            
            <section className="scroll-mt-24">
              <Card className="relative overflow-hidden border-primary/30 p-8 sm:p-12 text-center">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,165,10,0.12),transparent_70%)]" />
                <div className="relative">
                  <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Ready to earn?</h2>
                  <p className="text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
                    Once your node is synced, registration takes about five minutes. Points start accruing immediately and roll into the
                    next weekly snapshot.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/register">
                      <Button size="lg" className="w-full sm:w-auto">
                        Register a Node <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <Link to="/leaderboard">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto">
                        See top operators
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

interface FlowStepProps {
  step: number;
  icon: React.ReactNode;
  title: string;
  body: string;
}

function FlowStep({ step, icon, title, body }: FlowStepProps) {
  return (
    <Card className="bg-card border-border p-5">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-primary font-bold">{step}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {icon}
            <h3 className="font-semibold text-foreground">{title}</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
        </div>
      </div>
    </Card>
  );
}

interface SpecRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function SpecRow({ icon, label, value }: SpecRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <span className="text-sm text-foreground font-medium">{value}</span>
    </div>
  );
}

interface TimelineRowProps {
  icon: React.ReactNode;
  step: string;
  duration: string;
  detail: string;
  isLast?: boolean;
}

function TimelineRow({ icon, step, duration, detail, isLast }: TimelineRowProps) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
          {icon}
        </div>
        {!isLast && <div className="w-px flex-1 bg-border mt-1" />}
      </div>
      <Card className="flex-1 bg-card border-border p-4 mb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
          <h3 className="font-semibold text-foreground">{step}</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground inline-block w-fit">{duration}</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{detail}</p>
      </Card>
    </div>
  );
}
