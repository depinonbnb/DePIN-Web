/**
 * Coverage gaps: getExplorerNodes and getNodesByWallet
 *
 * Neither function is covered by api.test.ts or api-gaps.test.ts.
 * Both have subtle field-alias logic and non-standard response shapes
 * (raw array, not wrapped in {success, data}) that need explicit tests.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getExplorerNodes, getNodesByWallet } from '../src/lib/api';

const mockFetch = vi.fn();
beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
  mockFetch.mockReset();
});

// ─────────────────────────────────────────────────────────────
// getExplorerNodes
// ─────────────────────────────────────────────────────────────
//
// NOTE: this function expects the backend to return a raw JSON array
// (not the {success, data} envelope used by getLeaderboard). When the
// body is not an array it returns [].

describe('getExplorerNodes', () => {
  it('maps all backend fields to ExplorerNode on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          rank: 1,
          node_id: 'node-abc',
          wallet_address: '0xWallet',
          node_type: 'bsc-full',
          total_points: 500,
          total_uptime_hours: 100,
          challenge_pass_rate: 0.95,
          registered_at: 1_700_000_000,
        },
      ],
    });

    const nodes = await getExplorerNodes();
    expect(nodes).toHaveLength(1);
    expect(nodes[0]).toMatchObject({
      rank: 1,
      nodeId: 'node-abc',
      walletAddress: '0xWallet',
      nodeType: 'bsc-full',
      totalPoints: 500,
      totalUptimeHours: 100,
      challengePassRate: 0.95,
      registeredAt: 1_700_000_000,
    });
  });

  it('defaults totalPoints to 0 when null', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ rank: 1, node_id: 'n', wallet_address: '0x', node_type: 'bsc-fast', total_points: null }],
    });
    const nodes = await getExplorerNodes();
    expect(nodes[0].totalPoints).toBe(0);
  });

  it('defaults totalUptimeHours to 0 when null', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ rank: 2, node_id: 'n2', wallet_address: '0x', node_type: 'bsc-fast', total_uptime_hours: null }],
    });
    const nodes = await getExplorerNodes();
    expect(nodes[0].totalUptimeHours).toBe(0);
  });

  it('defaults challengePassRate to 0 when null', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ rank: 1, node_id: 'n', wallet_address: '0x', node_type: 'bsc-fast', challenge_pass_rate: null }],
    });
    const nodes = await getExplorerNodes();
    expect(nodes[0].challengePassRate).toBe(0);
  });

  it('returns [] when response body is not an array (e.g. envelope object)', async () => {
    // backend temporarily returns the {success, data} envelope
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    });
    const nodes = await getExplorerNodes();
    expect(nodes).toEqual([]);
  });

  it('returns [] on network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network down'));
    const nodes = await getExplorerNodes();
    expect(nodes).toEqual([]);
  });

  it('returns [] when response body is null', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => null });
    const nodes = await getExplorerNodes();
    expect(nodes).toEqual([]);
  });

  it('returns [] when response body is a string', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => 'error' });
    const nodes = await getExplorerNodes();
    expect(nodes).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────
// getNodesByWallet
// ─────────────────────────────────────────────────────────────
//
// Key behaviours:
//   - wallet is lowercased in the URL
//   - field aliases: ID/id/node_id, WalletAddress/wallet_address, etc.
//   - TotalUptimeMinutes converted to hours (/60)
//   - rank is always 0 (not returned by this endpoint)
//   - challengePassRate always 0 (not available per-wallet)

describe('getNodesByWallet', () => {
  it('lowercases the wallet address in the request URL', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
    await getNodesByWallet('0xABCDEF');
    const [url] = mockFetch.mock.calls[0] as [string, RequestInit?];
    expect(url).toContain('0xabcdef');
    expect(url).not.toContain('0xABCDEF');
  });

  it('maps Go-style uppercase field aliases (ID, WalletAddress, NodeType, etc.)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          ID: 'node-1',
          WalletAddress: '0xwallet',
          NodeType: 'bsc-archive',
          TotalPoints: 1234,
          TotalUptimeMinutes: 120,
          RegisteredAt: 1_710_000_000,
        },
      ],
    });
    const nodes = await getNodesByWallet('0xwallet');
    expect(nodes).toHaveLength(1);
    expect(nodes[0].nodeId).toBe('node-1');
    expect(nodes[0].walletAddress).toBe('0xwallet');
    expect(nodes[0].nodeType).toBe('bsc-archive');
    expect(nodes[0].totalPoints).toBe(1234);
    expect(nodes[0].totalUptimeHours).toBeCloseTo(2); // 120 min / 60
    expect(nodes[0].registeredAt).toBe(1_710_000_000);
  });

  it('maps snake_case aliases (wallet_address, node_type, total_points, registered_at)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          node_id: 'node-2',
          wallet_address: '0xwallet2',
          node_type: 'opbnb-full',
          total_points: 999,
          registered_at: 1_720_000_000,
        },
      ],
    });
    const nodes = await getNodesByWallet('0xwallet2');
    expect(nodes[0].nodeId).toBe('node-2');
    expect(nodes[0].nodeType).toBe('opbnb-full');
    expect(nodes[0].totalPoints).toBe(999);
    expect(nodes[0].registeredAt).toBe(1_720_000_000);
  });

  it('prefers id alias when ID is absent', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 'node-via-id', wallet_address: '0x', node_type: 'bsc-fast' }],
    });
    const nodes = await getNodesByWallet('0x');
    expect(nodes[0].nodeId).toBe('node-via-id');
  });

  it('defaults totalUptimeHours to 0 when TotalUptimeMinutes is absent', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ ID: 'n', WalletAddress: '0x', NodeType: 'bsc-full' }],
    });
    const nodes = await getNodesByWallet('0x');
    expect(nodes[0].totalUptimeHours).toBe(0);
  });

  it('always sets rank to 0', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ ID: 'n', WalletAddress: '0x', NodeType: 'bsc-full', rank: 99 }],
    });
    const nodes = await getNodesByWallet('0x');
    // rank from server is ignored — this endpoint always returns 0
    expect(nodes[0].rank).toBe(0);
  });

  it('returns [] when response body is not an array', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    });
    const nodes = await getNodesByWallet('0xwallet');
    expect(nodes).toEqual([]);
  });

  it('returns [] on network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('ECONNREFUSED'));
    const nodes = await getNodesByWallet('0xwallet');
    expect(nodes).toEqual([]);
  });

  it('returns an empty array for a wallet with no nodes', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
    const nodes = await getNodesByWallet('0xempty');
    expect(nodes).toEqual([]);
  });
});
