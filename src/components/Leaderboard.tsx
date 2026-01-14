import { useEffect, useState } from 'react';
import { getLeaderboard, LeaderboardNode } from '../lib/api';
import { Trophy, Medal } from 'lucide-react';

export function Leaderboard() {
  const [nodes, setNodes] = useState<LeaderboardNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard().then(data => {
      setNodes(data);
      setLoading(false);
    });
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-primary" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-muted-foreground" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-600" />;
    return <span className="text-muted-foreground">#{rank}</span>;
  };

  if (loading) {
    return (
      <section className="mx-10 my-12" id="leaderboard">
        <h2 className="text-foreground mb-6">Top Nodes</h2>
        <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
          <div className="h-64 bg-muted rounded" />
        </div>
      </section>
    );
  }

  return (
    <section className="mx-4 sm:mx-6 lg:mx-10 my-8 sm:my-12" id="leaderboard">
      <h2 className="text-foreground mb-4 sm:mb-6">Top Nodes</h2>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-foreground text-sm sm:text-base">Rank</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-foreground text-sm sm:text-base">Address</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-foreground text-sm sm:text-base">Bandwidth (GB)</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-foreground text-sm sm:text-base">Uptime (%)</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-foreground text-sm sm:text-base">Reputation</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-foreground text-sm sm:text-base">Points</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map((node) => (
                  <tr key={node.address} className="border-t border-border hover:bg-muted/50 transition-colors">
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2">
                        {getRankIcon(node.rank)}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-mono text-foreground text-sm sm:text-base">{node.address}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right text-foreground text-sm sm:text-base">{node.bandwidth.toFixed(1)}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                      <span className="text-accent text-sm sm:text-base">{node.uptime.toFixed(1)}%</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                      <span className="text-primary text-sm sm:text-base">{node.reputation}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right text-foreground text-sm sm:text-base">{node.points.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

