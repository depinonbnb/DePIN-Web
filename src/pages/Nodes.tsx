import { Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Server, Search, Trophy, ArrowRight } from 'lucide-react';

// Node management is prover-based (off-chain) and node data is served by the
// API and surfaced on the explorer/leaderboard. This page intentionally does
// not talk to any on-chain staking contract — it just points operators at the
// right place.
export function Nodes() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl text-foreground mb-2">Node Dashboard</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Nodes are registered from your terminal with the open-source prover — not from this page.
          Track live nodes, points, sync status, and token-holder status on the explorer and
          leaderboard.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Card className="bg-card border-border p-6">
            <Server className="w-5 h-5 text-primary mb-3" />
            <h3 className="text-foreground font-medium mb-1">Run &amp; register a node</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Spin up a BNB Chain node and register it with the prover. Step-by-step guide included.
            </p>
            <Link to="/register">
              <Button className="w-full">
                Register a node <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>

          <Card className="bg-card border-border p-6">
            <Search className="w-5 h-5 text-primary mb-3" />
            <h3 className="text-foreground font-medium mb-1">Find a node by wallet</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Search any wallet on the explorer to see its nodes, points, sync status, and
              token-holder badge.
            </p>
            <Link to="/explorer">
              <Button variant="outline" className="w-full">
                Open explorer <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>
        </div>

        <Card className="bg-card border-border p-6">
          <Trophy className="w-5 h-5 text-primary mb-3" />
          <h3 className="text-foreground font-medium mb-1">Leaderboard</h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            See the top nodes by points across the network.
          </p>
          <Link to="/leaderboard">
            <Button variant="outline">
              View leaderboard <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
