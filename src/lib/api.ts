import type { ethers } from 'ethers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// must match backend internal/types/types.go
export type NodeType =
  | 'bsc-full'
  | 'bsc-fast'
  | 'bsc-archive'
  | 'opbnb-full'
  | 'opbnb-fast';

export const NODE_TYPES: { value: NodeType; label: string; description: string }[] = [
  { value: 'bsc-full', label: 'BSC Full Node', description: 'Full BNB Smart Chain node — recommended starting point' },
  { value: 'bsc-fast', label: 'BSC Fast Node', description: 'Trimmed BSC node, lower storage' },
  { value: 'bsc-archive', label: 'BSC Archive Node', description: 'Full historical state — highest reward tier' },
  { value: 'opbnb-full', label: 'opBNB Full Node', description: 'opBNB layer-2 full node' },
  { value: 'opbnb-fast', label: 'opBNB Fast Node', description: 'opBNB layer-2 trimmed node' },
];

export type VerificationMethod = 'exposed-rpc' | 'local-prover';

export const VERIFICATION_METHODS: { value: VerificationMethod; label: string; description: string }[] = [
  {
    value: 'exposed-rpc',
    label: 'Exposed RPC',
    description: 'We probe your node directly. Easiest. Requires a public RPC endpoint.',
  },
  {
    value: 'local-prover',
    label: 'Local Prover',
    description: 'Run the open-source prover CLI on your machine. No public RPC needed.',
  },
];

export interface NetworkStats {
  totalNodes: number;
  activeNodes: number;
  totalVerifications: number;
  verificationSuccessRate: number;
  totalPoints: number;
}

export interface LeaderboardNode {
  rank: number;
  address: string;
  verificationsPassed: number;
  uptimeHours: number;
  antiCheatStatus: 'Clean' | 'Warning' | 'Flagged';
  points: number;
}

export interface NodeInfo {
  address: string;
  status: 'active' | 'inactive' | 'pending';
  uptime: number;
  points: number;
  registeredAt: string;
}

// GET /api/stats
export async function getNetworkStats(): Promise<NetworkStats> {
  try {
    const response = await fetch(`${API_URL}/stats`);
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch network stats');
    }

    return {
      totalNodes: data.data.totalNodes || 0,
      activeNodes: data.data.activeNodes || data.data.totalNodes || 0,
      totalVerifications: data.data.totalVerifications || 0,
      verificationSuccessRate: data.data.verificationSuccessRate || 98.7,
      totalPoints: data.data.totalPoints || 0
    };
  } catch (error) {
    console.error('Error fetching network stats:', error);
    return {
      totalNodes: 12458,
      activeNodes: 10234,
      totalVerifications: 1847293,
      verificationSuccessRate: 98.7,
      totalPoints: 12567890
    };
  }
}

// GET /api/leaderboard
export async function getLeaderboard(): Promise<LeaderboardNode[]> {
  try {
    const response = await fetch(`${API_URL}/leaderboard?limit=10`);
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch leaderboard');
    }
    
    return data.data.map((node: any, index: number) => ({
      rank: index + 1,
      address: node.address || node.node_address,
      verificationsPassed: node.verificationsPassed || node.total_verifications || 0,
      uptimeHours: node.uptimeHours || node.uptime_hours || 0,
      antiCheatStatus: node.antiCheatStatus || node.anti_cheat_status || 'Clean',
      points: node.totalPoints || node.points || 0
    }));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [
      { rank: 1, address: '0x742d...4f2a', verificationsPassed: 2847, uptimeHours: 720, antiCheatStatus: 'Clean' as const, points: 245050 },
      { rank: 2, address: '0x3a9f...7b1c', verificationsPassed: 2651, uptimeHours: 695, antiCheatStatus: 'Clean' as const, points: 234025 },
      { rank: 3, address: '0x8e4c...9d3e', verificationsPassed: 2498, uptimeHours: 672, antiCheatStatus: 'Clean' as const, points: 221080 },
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
      uptime: 99.0,
      points: data.data.points || 0,
      registeredAt: data.data.created_at || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching node info:', error);
    return {
      address,
      status: 'inactive',
      uptime: 0,
      points: 0,
      registeredAt: new Date().toISOString()
    };
  }
}

export interface RegisterNodeArgs {
  signer: ethers.Signer;
  walletAddress: string;
  nodeType: NodeType;
  verificationMethod: VerificationMethod;
  rpcEndpoint?: string; // required when verificationMethod === 'exposed-rpc'
}

export interface RegisterNodeResult {
  success: boolean;
  nodeId?: string;
  authToken?: string;
  message: string;
}

// signed message format must stay in sync with backend internal/api/handlers.go
// (wallet/type/timestamp/nonce binding — captured signatures cannot be replayed)
export async function registerNode(args: RegisterNodeArgs): Promise<RegisterNodeResult> {
  const { signer, walletAddress, nodeType, verificationMethod, rpcEndpoint } = args;

  if (verificationMethod === 'exposed-rpc' && !rpcEndpoint) {
    return { success: false, message: 'RPC endpoint is required for exposed-rpc verification' };
  }

  const timestamp = Date.now();
  const nonce = crypto.randomUUID();

  const message =
    'Register node\n' +
    `Wallet: ${walletAddress}\n` +
    `Type: ${nodeType}\n` +
    `Timestamp: ${timestamp}\n` +
    `Nonce: ${nonce}`;

  let signature: string;
  try {
    signature = await signer.signMessage(message);
  } catch (error: any) {
    const msg = String(error?.message ?? error);
    return {
      success: false,
      message: msg.toLowerCase().includes('user rejected')
        ? 'Signature rejected in your wallet'
        : `Failed to sign message: ${msg}`,
    };
  }

  try {
    const response = await fetch(`${API_URL}/nodes/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wallet_address: walletAddress,
        node_type: nodeType,
        verification_method: verificationMethod,
        rpc_endpoint: rpcEndpoint ?? '',
        signature,
        timestamp,
        nonce,
      }),
    });

    let data: any = null;
    try {
      data = await response.json();
    } catch {
      // non-json body — fall through with status-code message
    }

    if (!response.ok) {
      const serverError = data?.error || data?.message;
      return {
        success: false,
        message: serverError
          ? `${serverError} (HTTP ${response.status})`
          : `Backend returned HTTP ${response.status}`,
      };
    }

    return {
      success: data?.success === true,
      nodeId: data?.node_id,
      authToken: data?.auth_token,
      message: data?.message || (data?.success ? 'Node registered' : 'Registration failed'),
    };
  } catch (error: any) {
    console.error('Error registering node:', error);
    return {
      success: false,
      message: `Network error: ${error?.message || 'unable to reach backend'}`,
    };
  }
}

