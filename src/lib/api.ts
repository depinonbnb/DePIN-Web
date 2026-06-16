import type { ethers } from 'ethers';
import { formatEther } from 'ethers';
import { REWARD_VAULT_ADDRESS } from './contracts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// A payout: an outgoing BNB transfer from the rewards vault to a node operator.
export interface Payout {
  to: string;
  valueBnb: string;
  timestamp: number; // ms
  hash: string;
}

// getVaultPayouts lists recent outgoing BNB transfers from the rewards vault via
// the Etherscan V2 API (chainid 56 = BSC mainnet). Requires VITE_BSCSCAN_API_KEY
// (a free key from etherscan.io). Returns [] when the key is unset or on error.
export async function getVaultPayouts(limit = 10): Promise<Payout[]> {
  const key = import.meta.env.VITE_BSCSCAN_API_KEY as string | undefined;
  if (!key) return [];

  const vault = REWARD_VAULT_ADDRESS.toLowerCase();
  const url =
    `https://api.etherscan.io/v2/api?chainid=56&module=account&action=txlist` +
    `&address=${vault}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc&apikey=${key}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.status !== '1' || !Array.isArray(data.result)) return [];

    return data.result
      .filter(
        (tx: any) =>
          tx.from?.toLowerCase() === vault && tx.value !== '0' && tx.isError === '0'
      )
      .slice(0, limit)
      .map((tx: any) => ({
        to: tx.to,
        valueBnb: parseFloat(formatEther(tx.value)).toLocaleString(undefined, {
          maximumFractionDigits: 4,
        }),
        timestamp: Number(tx.timeStamp) * 1000,
        hash: tx.hash,
      }));
  } catch {
    return [];
  }
}

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

const EMPTY_STATS: NetworkStats = {
  totalNodes: 0,
  activeNodes: 0,
  totalVerifications: 0,
  verificationSuccessRate: 0,
  totalPoints: 0,
};

// GET /api/stats — backend returns a flat snake_case object
export async function getNetworkStats(): Promise<NetworkStats> {
  try {
    const response = await fetch(`${API_URL}/stats`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    return {
      totalNodes: data.total_nodes ?? 0,
      activeNodes: data.active_nodes ?? 0,
      totalVerifications: data.total_verifications ?? 0,
      verificationSuccessRate: data.verification_success_rate ?? 0,
      totalPoints: data.total_points ?? 0,
    };
  } catch (error) {
    console.error('Error fetching network stats:', error);
    return EMPTY_STATS;
  }
}

function mapCheatStatus(status: unknown): 'Clean' | 'Warning' | 'Flagged' {
  switch (status) {
    case 'warning':
      return 'Warning';
    case 'flagged':
      return 'Flagged';
    default:
      return 'Clean';
  }
}

// GET /api/leaderboard — backend returns a raw array of snake_case entries
export async function getLeaderboard(): Promise<LeaderboardNode[]> {
  try {
    const response = await fetch(`${API_URL}/leaderboard`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) return [];

    return data.map((node: any) => ({
      rank: node.rank ?? 0,
      address: node.wallet_address ?? '',
      verificationsPassed: node.total_challenges_passed ?? 0,
      uptimeHours: node.total_uptime_hours ?? 0,
      antiCheatStatus: mapCheatStatus(node.cheat_status),
      points: node.total_points ?? 0,
    }));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

// GET /api/nodes/:nodeId — backend returns the raw node object (snake_case)
export async function getNodeInfo(nodeId: string): Promise<NodeInfo> {
  try {
    const response = await fetch(`${API_URL}/nodes/${nodeId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    return {
      address: data.wallet_address ?? '',
      status: data.is_active ? 'active' : 'inactive',
      uptime: (data.total_uptime_minutes ?? 0) / 60,
      points: data.total_points ?? 0,
      registeredAt: data.registered_at ? new Date(data.registered_at * 1000).toISOString() : new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching node info:', error);
    return {
      address: '',
      status: 'inactive',
      uptime: 0,
      points: 0,
      registeredAt: new Date().toISOString()
    };
  }
}

export interface ExplorerNode {
  rank: number;
  nodeId: string;
  walletAddress: string;
  nodeType: NodeType;
  totalPoints: number;
  totalUptimeHours: number;
  challengePassRate: number;
  registeredAt: number;
  isSynced: boolean;
  lastHeartbeatAt: number;
}

// Derives a display sync status from the raw flags.
export type SyncStatus = 'synced' | 'syncing' | 'pending';
export function syncStatusOf(node: { isSynced: boolean; lastHeartbeatAt: number }): SyncStatus {
  if (node.isSynced) return 'synced';
  if (node.lastHeartbeatAt > 0) return 'syncing';
  return 'pending';
}

// GET /api/leaderboard — returns all active non-banned nodes (max 100, sorted by points desc)
export async function getExplorerNodes(): Promise<ExplorerNode[]> {
  try {
    const response = await fetch(`${API_URL}/leaderboard`);
    const data = await response.json();
    if (!Array.isArray(data)) return [];
    return data.map((n: any) => ({
      rank: n.rank,
      nodeId: n.node_id,
      walletAddress: n.wallet_address,
      nodeType: n.node_type,
      totalPoints: n.total_points ?? 0,
      totalUptimeHours: n.total_uptime_hours ?? 0,
      challengePassRate: n.challenge_pass_rate ?? 0,
      registeredAt: n.registered_at ?? 0,
      isSynced: n.is_synced ?? false,
      lastHeartbeatAt: n.last_heartbeat_at ?? 0,
    }));
  } catch (error) {
    console.error('Error fetching explorer nodes:', error);
    return [];
  }
}

// GET /api/nodes/wallet/:walletAddress
export async function getNodesByWallet(wallet: string): Promise<ExplorerNode[]> {
  try {
    const response = await fetch(`${API_URL}/nodes/wallet/${wallet.toLowerCase()}`);
    const data = await response.json();
    if (!Array.isArray(data)) return [];
    return data.map((n: any) => ({
      rank: 0,
      nodeId: n.id ?? '',
      walletAddress: n.wallet_address ?? '',
      nodeType: n.node_type,
      totalPoints: n.total_points ?? 0,
      totalUptimeHours: (n.total_uptime_minutes ?? 0) / 60,
      challengePassRate: 0,
      registeredAt: n.registered_at ?? 0,
      isSynced: n.is_synced ?? false,
      lastHeartbeatAt: n.last_heartbeat_at ?? 0,
    }));
  } catch (error) {
    console.error('Error fetching nodes by wallet:', error);
    return [];
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

