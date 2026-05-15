import { useEffect, useState } from 'react';
import { getNodeInfo, NodeInfo as NodeInfoType } from '../lib/api';
import { Badge } from './ui/badge';
import { Calendar, Activity, Coins } from 'lucide-react';

interface NodeInfoProps {
  address: string;
}

export function NodeInfo({ address }: NodeInfoProps) {
  const [nodeInfo, setNodeInfo] = useState<NodeInfoType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getNodeInfo(address).then((nodeData) => {
      setNodeInfo(nodeData);
      setLoading(false);
    });
  }, [address]);

  if (loading || !nodeInfo) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
        <div className="h-64 bg-muted rounded" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-accent text-accent-foreground';
      case 'inactive': return 'bg-destructive text-destructive-foreground';
      case 'pending': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-foreground">Node Information</h3>
        <Badge className={getStatusColor(nodeInfo.status)}>
          {nodeInfo.status.toUpperCase()}
        </Badge>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-muted-foreground text-sm mb-1">Address</div>
          <div className="text-foreground font-mono">{nodeInfo.address}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Activity className="w-4 h-4" />
              Uptime
            </div>
            <div className="text-accent">{nodeInfo.uptime}%</div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Coins className="w-4 h-4" />
              Points
            </div>
            <div className="text-foreground">{nodeInfo.points.toLocaleString()}</div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <Calendar className="w-4 h-4" />
            Registered
          </div>
          <div className="text-foreground">
            {new Date(nodeInfo.registeredAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

