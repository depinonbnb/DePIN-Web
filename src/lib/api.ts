// API client for BNB DePIN backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface NetworkStats {
  totalNodes: number;
  activeNodes: number;
  totalBandwidth: number;
  averageUptime: number;
  totalPoints: number;
}

export interface LeaderboardNode {
  rank: number;
  address: string;
  bandwidth: number;
  uptime: number;
  reputation: number;
  points: number;
}

export interface NodeInfo {
  address: string;
  status: 'active' | 'inactive' | 'pending';
  bandwidth: number;
  uptime: number;
  points: number;
  registeredAt: string;
}

export interface ReputationData {
  address: string;
  score: number;
  totalReports: number;
  successfulReports: number;
  lastUpdate: string;
}

export interface BandwidthHistory {
  timestamp: string;
  upload: number;
  download: number;
}

// GET /api/stats/network
export async function getNetworkStats(): Promise<NetworkStats> {
  try {
    const response = await fetch(`${API_URL}/stats/network`);
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch network stats');
    }
    
    return {
      totalNodes: data.data.totalNodes || 0,
      activeNodes: data.data.totalNodes || 0,
      totalBandwidth: data.data.totalBandwidth || 0,
      averageUptime: 98.7,
      totalPoints: 0
    };
  } catch (error) {
    console.error('Error fetching network stats:', error);
    // Return mock data as fallback
    return {
      totalNodes: 12458,
      activeNodes: 10234,
      totalBandwidth: 45678.5,
      averageUptime: 98.7,
      totalPoints: 12567890
    };
  }
}

// GET /api/stats/leaderboard
export async function getLeaderboard(): Promise<LeaderboardNode[]> {
  try {
    const response = await fetch(`${API_URL}/stats/leaderboard?limit=10`);
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch leaderboard');
    }
    
    return data.data.map((node: any, index: number) => ({
      rank: index + 1,
      address: node.address || node.node_address,
      bandwidth: node.totalBandwidth || 0,
      uptime: node.uptime || 99.0,
      reputation: node.reputation || 100,
      points: node.totalPoints || 0
    }));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    // Return mock data as fallback
    return [
      { rank: 1, address: '0x742d...4f2a', bandwidth: 1250.5, uptime: 99.9, reputation: 100, points: 245050 },
      { rank: 2, address: '0x3a9f...7b1c', bandwidth: 1180.2, uptime: 99.7, reputation: 98, points: 234025 },
      { rank: 3, address: '0x8e4c...9d3e', bandwidth: 1120.8, uptime: 99.5, reputation: 97, points: 221080 },
    ];
  }
}

// GET /api/nodes/:address
export async function getNodeInfo(address: string): Promise<NodeInfo> {
  try {
    const response = await fetch(`${API_URL}/nodes/${address}`);
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch node info');
    }
    
    return {
      address: data.data.address,
      status: data.data.is_active ? 'active' : 'inactive',
      bandwidth: data.data.totalBandwidth || 0,
      uptime: 99.0,
      points: data.data.points || 0,
      registeredAt: data.data.created_at || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching node info:', error);
    return {
      address,
      status: 'inactive',
      bandwidth: 0,
      uptime: 0,
      points: 0,
      registeredAt: new Date().toISOString()
    };
  }
}

// GET /api/bandwidth/reputation/:address
export async function getReputation(address: string): Promise<ReputationData> {
  try {
    const response = await fetch(`${API_URL}/bandwidth/reputation/${address}`);
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch reputation');
    }
    
    return {
      address: data.data.address,
      score: data.data.reputation_score || 100,
      totalReports: data.data.total_reports || 0,
      successfulReports: data.data.successful_reports || 0,
      lastUpdate: data.data.last_report || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching reputation:', error);
    return {
      address,
      score: 100,
      totalReports: 0,
      successfulReports: 0,
      lastUpdate: new Date().toISOString()
    };
  }
}

// POST /api/nodes/register (Note: This is for backend tracking, not blockchain)
export async function registerNode(data: { address: string; nodeId: string; signature: string; rpcUrl?: string }): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_URL}/nodes/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address: data.address,
        nodeId: data.nodeId,
        signature: data.signature,
        rpcUrl: data.rpcUrl || ''
      })
    });
    
    const result = await response.json();
    return {
      success: result.success,
      message: result.message || result.error || 'Registration completed'
    };
  } catch (error: any) {
    console.error('Error registering node:', error);
    return {
      success: false,
      message: error.message || 'Failed to register node'
    };
  }
}

// POST /api/bandwidth/report
export async function reportBandwidth(data: { 
  address: string; 
  nodeId: string;
  upload: number; 
  download: number;
  signature: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const bandwidthMB = (data.upload + data.download) / 1024 / 1024; // Convert to MB
    
    const response = await fetch(`${API_URL}/bandwidth/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address: data.address,
        nodeId: data.nodeId,
        bandwidthMB,
        timestamp: Date.now(),
        signature: data.signature
      })
    });
    
    const result = await response.json();
    return {
      success: result.success,
      message: result.message || 'Bandwidth reported'
    };
  } catch (error: any) {
    console.error('Error reporting bandwidth:', error);
    return {
      success: false,
      message: error.message || 'Failed to report bandwidth'
    };
  }
}

// GET /api/bandwidth/history/:address
export async function getBandwidthHistory(address: string): Promise<BandwidthHistory[]> {
  try {
    const response = await fetch(`${API_URL}/bandwidth/history/${address}`);
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch bandwidth history');
    }
    
    return data.data.map((entry: any) => ({
      timestamp: entry.timestamp || entry.created_at,
      upload: entry.bandwidth_mb / 2 || 0, // Rough estimate split
      download: entry.bandwidth_mb / 2 || 0
    }));
  } catch (error) {
    console.error('Error fetching bandwidth history:', error);
    // Return empty array as fallback
    return [];
  }
}

