import { useEffect, useState } from 'react';
import { getBandwidthHistory, BandwidthHistory } from '../lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BandwidthChartProps {
  address: string;
}

export function BandwidthChart({ address }: BandwidthChartProps) {
  const [history, setHistory] = useState<BandwidthHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBandwidthHistory(address).then(data => {
      setHistory(data);
      setLoading(false);
    });
  }, [address]);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
        <div className="h-80 bg-muted rounded" />
      </div>
    );
  }

  const chartData = history.map(item => ({
    time: new Date(item.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    Upload: item.upload,
    Download: item.download
  }));

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
      <h3 className="text-foreground mb-4 text-base sm:text-lg">Bandwidth History (Last 24 Hours)</h3>
      <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis 
            dataKey="time" 
            stroke="var(--muted-foreground)"
            tick={{ fill: 'var(--muted-foreground)' }}
          />
          <YAxis 
            stroke="var(--muted-foreground)"
            tick={{ fill: 'var(--muted-foreground)' }}
            label={{ value: 'MB/s', angle: -90, position: 'insideLeft', fill: 'var(--muted-foreground)' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#181A20', 
              border: '1px solid #2B3139',
              borderRadius: '8px',
              color: '#FFFFFF'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="Upload" 
            stroke="#FCD535" 
            strokeWidth={2}
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="Download" 
            stroke="#0ECB81" 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

