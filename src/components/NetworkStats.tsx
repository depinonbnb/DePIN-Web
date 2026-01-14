import { useEffect, useState } from 'react';
import { getNetworkStats, NetworkStats as NetworkStatsType } from '../lib/api';
import { Activity, Server, Wifi, TrendingUp } from 'lucide-react';

export function NetworkStats() {
  const [stats, setStats] = useState<NetworkStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNetworkStats().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) {
    return (
      <section className="mx-10 my-12">
        <h2 className="text-foreground mb-6">Network Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
              <div className="h-12 bg-muted rounded mb-2" />
              <div className="h-6 bg-muted rounded w-2/3" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-4 sm:mx-6 lg:mx-10 my-8 sm:my-12">
      <h2 className="text-foreground mb-4 sm:mb-6">Network Statistics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Server className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <div className="text-muted-foreground text-sm sm:text-base">Total Nodes</div>
          </div>
          <div className="text-2xl sm:text-3xl text-foreground">{stats.totalNodes.toLocaleString()}</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            <div className="text-muted-foreground text-sm sm:text-base">Active Nodes</div>
          </div>
          <div className="text-2xl sm:text-3xl text-foreground">{stats.activeNodes.toLocaleString()}</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Wifi className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <div className="text-muted-foreground text-sm sm:text-base">Total Bandwidth</div>
          </div>
          <div className="text-2xl sm:text-3xl text-foreground">{stats.totalBandwidth.toFixed(1)} <span className="text-base sm:text-lg">TB</span></div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            <div className="text-muted-foreground text-sm sm:text-base">Avg Uptime</div>
          </div>
          <div className="text-2xl sm:text-3xl text-foreground">{stats.averageUptime.toFixed(1)}<span className="text-base sm:text-lg">%</span></div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <div className="text-muted-foreground text-sm sm:text-base">Total Points</div>
          </div>
          <div className="text-2xl sm:text-3xl text-foreground">{stats.totalPoints.toLocaleString()}</div>
        </div>
      </div>
    </section>
  );
}

