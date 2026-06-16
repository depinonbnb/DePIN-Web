import { useEffect, useState } from 'react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  getExplorerNodes,
  getNodesByWallet,
  getNetworkStats,
  syncStatusOf,
  NODE_TYPES,
  type ExplorerNode,
  type NetworkStats,
} from '../lib/api';
import {
  Search,
  Server,
  Users,
  Activity,
  Award,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

function truncateAddress(addr: string): string {
  if (!addr || addr.length < 12) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatDate(timestamp: number): string {
  if (!timestamp) return '—';
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function nodeTypeLabel(type: string): string {
  return NODE_TYPES.find((t) => t.value === type)?.label ?? type;
}

export function Explorer() {
  const [nodes, setNodes] = useState<ExplorerNode[]>([]);
  const [filteredNodes, setFilteredNodes] = useState<ExplorerNode[]>([]);
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [expandedNode, setExpandedNode] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<'all' | 'wallet'>('all');

  useEffect(() => {
    Promise.all([getExplorerNodes(), getNetworkStats()]).then(([nodeData, statsData]) => {
      setNodes(nodeData);
      setFilteredNodes(nodeData);
      setStats(statsData);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = nodes;
    if (typeFilter !== 'all') {
      result = result.filter((n) => n.nodeType === typeFilter);
    }
    setFilteredNodes(result);
  }, [typeFilter, nodes]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchMode('all');
      setFilteredNodes(nodes.filter((n) => typeFilter === 'all' || n.nodeType === typeFilter));
      return;
    }

    const query = searchQuery.trim().toLowerCase();

    if (query.startsWith('0x') && query.length >= 10) {
      setLoading(true);
      setSearchMode('wallet');
      const walletNodes = await getNodesByWallet(query);
      setFilteredNodes(walletNodes);
      setLoading(false);
    } else {
      setSearchMode('all');
      const matched = nodes.filter(
        (n) =>
          n.nodeId.toLowerCase().includes(query) ||
          n.walletAddress.toLowerCase().includes(query)
      );
      setFilteredNodes(matched);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchMode('all');
    setTypeFilter('all');
    setFilteredNodes(nodes);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Node Explorer</h1>
          <p className="text-muted-foreground">
            Browse all active nodes on the DePIN-on-BNB network.
          </p>
        </div>

        {/* stats strip */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <StatCard icon={<Server className="w-4 h-4" />} label="Total Nodes" value={stats.totalNodes} />
            <StatCard icon={<Users className="w-4 h-4" />} label="Active" value={stats.activeNodes} />
            <StatCard icon={<Activity className="w-4 h-4" />} label="Verifications" value={stats.totalVerifications} />
            <StatCard icon={<Award className="w-4 h-4" />} label="Points Awarded" value={stats.totalPoints} />
          </div>
        )}

        {/* search + filter */}
        <Card className="bg-card border-border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex gap-2">
              <Input
                type="text"
                placeholder="Search by wallet address (0x...) or node ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} variant="outline" size="icon">
                <Search className="w-4 h-4" />
              </Button>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {NODE_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(searchQuery || typeFilter !== 'all') && (
              <Button onClick={clearSearch} variant="ghost" className="text-muted-foreground">
                Clear
              </Button>
            )}
          </div>
          {searchMode === 'wallet' && (
            <p className="text-xs text-muted-foreground mt-2">
              Showing nodes for wallet {truncateAddress(searchQuery)}
            </p>
          )}
        </Card>

        {/* results */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-card border border-border rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredNodes.length === 0 ? (
          <Card className="bg-card border-border p-12 text-center">
            <Server className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-foreground font-medium mb-1">No nodes found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? 'No nodes match your search. Try a different wallet address or node ID.'
                : 'No active nodes on the network yet. Be the first — register a node.'}
            </p>
          </Card>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-3">
              {filteredNodes.length} node{filteredNodes.length !== 1 ? 's' : ''}
              {typeFilter !== 'all' ? ` · ${nodeTypeLabel(typeFilter)}` : ''}
            </p>

            {/* table header (desktop) */}
            <div className="hidden md:grid grid-cols-[60px_1fr_1fr_120px_100px_100px_40px] gap-2 px-4 py-2 text-xs text-muted-foreground uppercase tracking-wide">
              <div>#</div>
              <div>Node</div>
              <div>Wallet</div>
              <div>Type</div>
              <div className="text-right">Points</div>
              <div className="text-right">Uptime</div>
              <div />
            </div>

            <div className="space-y-1.5">
              {filteredNodes.map((node) => (
                <NodeRow
                  key={node.nodeId}
                  node={node}
                  expanded={expandedNode === node.nodeId}
                  onToggle={() => setExpandedNode(expandedNode === node.nodeId ? null : node.nodeId)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card className="bg-card border-border p-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className="text-xl font-bold text-foreground">{value.toLocaleString()}</div>
    </Card>
  );
}

function SyncBadge({ node }: { node: ExplorerNode }) {
  const status = syncStatusOf(node);
  const meta = {
    synced: { dot: 'bg-accent', text: 'text-accent', label: 'Synced', pulse: false },
    syncing: { dot: 'bg-warning', text: 'text-warning', label: 'Syncing', pulse: true },
    pending: { dot: 'bg-muted-foreground', text: 'text-muted-foreground', label: 'Pending', pulse: false },
  }[status];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${meta.dot} ${meta.pulse ? 'animate-pulse' : ''}`} />
      <span className={`text-xs ${meta.text}`}>{meta.label}</span>
    </span>
  );
}

function NodeRow({ node, expanded, onToggle }: { node: ExplorerNode; expanded: boolean; onToggle: () => void }) {
  const typeMeta = NODE_TYPES.find((t) => t.value === node.nodeType);

  return (
    <Card className="bg-card border-border overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center text-left hover:bg-muted/30 transition-colors"
      >
        {/* desktop layout */}
        <div className="hidden md:grid grid-cols-[60px_1fr_1fr_120px_100px_100px_40px] gap-2 items-center w-full">
          <div className="text-sm text-muted-foreground">{node.rank || '—'}</div>
          <div className="text-sm font-mono text-foreground truncate">
            {node.nodeId}
            <div className="mt-0.5"><SyncBadge node={node} /></div>
          </div>
          <div className="text-sm font-mono text-muted-foreground truncate">{truncateAddress(node.walletAddress)}</div>
          <div>
            <Badge variant="outline" className="text-xs">
              {typeMeta?.label.replace(' Node', '') ?? node.nodeType}
            </Badge>
          </div>
          <div className="text-sm text-right font-medium text-primary">{node.totalPoints.toLocaleString()}</div>
          <div className="text-sm text-right text-foreground">{node.totalUptimeHours.toFixed(1)}h</div>
          <div className="flex justify-end">
            {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
        </div>

        {/* mobile layout */}
        <div className="md:hidden flex items-center justify-between w-full">
          <div>
            <div className="text-sm font-mono text-foreground">{node.nodeId}</div>
            <div className="text-xs text-muted-foreground">{truncateAddress(node.walletAddress)}</div>
            <div className="mt-1"><SyncBadge node={node} /></div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-primary">{node.totalPoints.toLocaleString()} pts</div>
            <Badge variant="outline" className="text-xs">
              {typeMeta?.label.replace(' Node', '') ?? node.nodeType}
            </Badge>
          </div>
        </div>
      </button>

      {/* expanded detail */}
      {expanded && (
        <div className="border-t border-border px-4 py-4 bg-muted/20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground text-xs mb-0.5">Wallet</div>
              <div className="text-foreground font-mono text-xs break-all">{node.walletAddress}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs mb-0.5">Node Type</div>
              <div className="text-foreground">{typeMeta?.label ?? node.nodeType}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs mb-0.5">Challenge Pass Rate</div>
              <div className="text-foreground">{node.challengePassRate.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs mb-0.5">Registered</div>
              <div className="text-foreground">{formatDate(node.registeredAt)}</div>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <a
              href={`https://bscscan.com/address/${node.walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              View on BscScan <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </Card>
  );
}
