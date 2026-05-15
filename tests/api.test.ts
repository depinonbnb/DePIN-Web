/**
 * Tests for src/lib/api.ts
 *
 * Setup (one-time):
 *   npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom
 *   Add to package.json: "test": "vitest", "test:run": "vitest run"
 *   Add to vite.config.ts:  test: { environment: 'jsdom', globals: true }
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getNetworkStats,
  getLeaderboard,
  getNodeInfo,
  getReputation,
  registerNode,
  reportBandwidth,
  getBandwidthHistory,
} from '../src/lib/api';

// Replace global fetch with a spy before each test.
const mockFetch = vi.fn();
beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
  mockFetch.mockReset();
});

// ==================
// getNetworkStats
// ==================

describe('getNetworkStats', () => {
  it('returns mapped data on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { totalNodes: 10, totalVerifications: 500, totalPoints: 9000 },
      }),
    });

    const stats = await getNetworkStats();
    expect(stats.totalNodes).toBe(10);
    expect(stats.totalVerifications).toBe(500);
    expect(stats.totalPoints).toBe(9000);
  });

  it('falls back to mock data on network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network down'));

    const stats = await getNetworkStats();
    // The fallback always has a non-zero totalNodes
    expect(stats.totalNodes).toBeGreaterThan(0);
  });

  it('falls back when response.ok is false', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, error: 'server error' }),
    });

    const stats = await getNetworkStats();
    expect(stats.totalNodes).toBeGreaterThan(0);
  });

  it('falls back when success flag is false', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false }),
    });

    const stats = await getNetworkStats();
    expect(stats.totalNodes).toBeGreaterThan(0);
  });
});

// ==================
// getLeaderboard
// ==================

describe('getLeaderboard', () => {
  it('maps backend fields correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          { address: '0xabc', total_verifications: 100, uptime_hours: 24, points: 500 },
        ],
      }),
    });

    const lb = await getLeaderboard();
    expect(lb).toHaveLength(1);
    expect(lb[0].rank).toBe(1);
    expect(lb[0].address).toBe('0xabc');
    expect(lb[0].verificationsPassed).toBe(100);
  });

  it('falls back to mock data on error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('fetch failed'));

    const lb = await getLeaderboard();
    expect(lb.length).toBeGreaterThan(0);
    expect(lb[0].rank).toBe(1);
  });
});

// ==================
// getNodeInfo
// ==================

describe('getNodeInfo', () => {
  it('returns active node info', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { address: '0xnode', is_active: true, points: 300 },
      }),
    });

    const info = await getNodeInfo('0xnode');
    expect(info.status).toBe('active');
    expect(info.points).toBe(300);
  });

  it('returns inactive status when is_active is false', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { address: '0xnode', is_active: false, points: 0 },
      }),
    });

    const info = await getNodeInfo('0xnode');
    expect(info.status).toBe('inactive');
  });

  it('returns fallback with the address on error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('server down'));

    const info = await getNodeInfo('0xunknown');
    expect(info.address).toBe('0xunknown');
    expect(info.status).toBe('inactive');
  });
});

// ==================
// getReputation
// ==================

describe('getReputation', () => {
  it('returns reputation data on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { address: '0xaddr', reputation_score: 85, total_reports: 10, successful_reports: 9 },
      }),
    });

    const rep = await getReputation('0xaddr');
    expect(rep.score).toBe(85);
    expect(rep.totalReports).toBe(10);
  });

  it('falls back with score=100 on error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('timeout'));

    const rep = await getReputation('0xaddr');
    expect(rep.score).toBe(100);
    expect(rep.address).toBe('0xaddr');
  });
});

// ==================
// registerNode
// ==================

describe('registerNode', () => {
  it('posts the right fields and returns success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'registered' }),
    });

    const result = await registerNode({
      address: '0xaddr',
      nodeId: 'n1',
      signature: '0xsig',
      rpcUrl: 'http://node:8545',
    });

    expect(result.success).toBe(true);
    expect(result.message).toBe('registered');

    // Verify the fetch body
    const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string);
    expect(url).toContain('/nodes/register');
    expect(body.signature).toBe('0xsig');
    expect(body.rpcUrl).toBe('http://node:8545');
  });

  it('uses empty string for missing rpcUrl', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    await registerNode({ address: '0xaddr', nodeId: 'n1', signature: '0x' });

    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string);
    expect(body.rpcUrl).toBe('');
  });

  it('returns success=false on network failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network down'));

    const result = await registerNode({ address: '0x', nodeId: 'n', signature: '0x' });
    expect(result.success).toBe(false);
    expect(result.message).toBeTruthy();
  });
});

// ==================
// reportBandwidth
// ==================

describe('reportBandwidth', () => {
  it('converts bytes to MB and posts', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    await reportBandwidth({
      address: '0xaddr',
      nodeId: 'n1',
      upload: 1024 * 1024,   // 1 MB
      download: 1024 * 1024, // 1 MB
      signature: '0xsig',
    });

    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string);
    // upload + download = 2MB → bandwidthMB = 2
    expect(body.bandwidthMB).toBeCloseTo(2);
  });

  it('returns success=false on error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('timeout'));
    const res = await reportBandwidth({ address: '0x', nodeId: 'n', upload: 0, download: 0, signature: '0x' });
    expect(res.success).toBe(false);
  });
});

// ==================
// getBandwidthHistory
// ==================

describe('getBandwidthHistory', () => {
  it('maps backend entries to upload/download split', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [{ timestamp: '2024-01-01', bandwidth_mb: 10 }],
      }),
    });

    const history = await getBandwidthHistory('0xaddr');
    expect(history).toHaveLength(1);
    expect(history[0].upload).toBeCloseTo(5);
    expect(history[0].download).toBeCloseTo(5);
  });

  it('returns empty array on error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('server error'));

    const history = await getBandwidthHistory('0xaddr');
    expect(history).toEqual([]);
  });
});
