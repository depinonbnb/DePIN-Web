/**
 * Gaps in test coverage for src/lib/api.ts
 *
 * The existing api.test.ts tests registerNode, reportBandwidth, and
 * getBandwidthHistory against a DELETED API shape.  Those three function
 * signatures no longer exist in the current api.ts.  This file covers:
 *
 *   1. registerNode — current signature (signer-based, SPEC §8 replay protection)
 *   2. getNetworkStats — uncovered field fallbacks
 *   3. getLeaderboard — antiCheatStatus + totalPoints alias
 *   4. getNodeInfo — registeredAt + uptime hardcode
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getNetworkStats,
  getLeaderboard,
  getNodeInfo,
  registerNode,
  type RegisterNodeArgs,
} from '../src/lib/api';

const mockFetch = vi.fn();
beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
  mockFetch.mockReset();
  // crypto.randomUUID must exist in the test environment
  vi.stubGlobal('crypto', { randomUUID: () => 'test-uuid' });
});

// ─────────────────────────────────────────────────────────────
// registerNode — current implementation (signer-based)
// ─────────────────────────────────────────────────────────────

function makeSigner(overrides?: Partial<{ signMessage: () => Promise<string> }>) {
  return {
    signMessage: vi.fn().mockResolvedValue('0xmocked-signature'),
    ...overrides,
  };
}

function makeRegisterArgs(overrides?: Partial<RegisterNodeArgs>): RegisterNodeArgs {
  return {
    signer: makeSigner() as any,
    walletAddress: '0xabc123',
    nodeType: 'bsc-full',
    verificationMethod: 'exposed-rpc',
    rpcEndpoint: 'http://node:8545',
    ...overrides,
  };
}

describe('registerNode — exposed-rpc validation', () => {
  it('returns failure immediately when exposed-rpc has no rpcEndpoint', async () => {
    // NOTE: no fetch call should be made in this path.
    const result = await registerNode(makeRegisterArgs({ rpcEndpoint: undefined }));
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/rpc endpoint/i);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('allows local-prover with no rpcEndpoint', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'ok' }),
    });
    const result = await registerNode(
      makeRegisterArgs({ verificationMethod: 'local-prover', rpcEndpoint: undefined }),
    );
    expect(result.success).toBe(true);
  });
});

describe('registerNode — wallet signing failures', () => {
  it('returns user-friendly message on 4001 user-rejected error', async () => {
    const signer = makeSigner({
      signMessage: vi.fn().mockRejectedValue({ message: 'User rejected the request' }),
    });
    const result = await registerNode(makeRegisterArgs({ signer: signer as any }));
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/rejected/i);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns generic failure on other signing errors', async () => {
    const signer = makeSigner({
      signMessage: vi.fn().mockRejectedValue(new Error('hw wallet timeout')),
    });
    const result = await registerNode(makeRegisterArgs({ signer: signer as any }));
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/failed to sign/i);
  });
});

describe('registerNode — HTTP error paths', () => {
  it('returns server error message from JSON body on !response.ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({ error: 'address already registered' }),
    });
    const result = await registerNode(makeRegisterArgs());
    expect(result.success).toBe(false);
    expect(result.message).toContain('address already registered');
    expect(result.message).toContain('409');
  });

  it('falls back to status-code message when body is not JSON', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 502,
      json: async () => { throw new Error('not json'); },
    });
    const result = await registerNode(makeRegisterArgs());
    expect(result.success).toBe(false);
    expect(result.message).toContain('502');
  });

  it('returns network error on fetch throw', async () => {
    mockFetch.mockRejectedValueOnce(new Error('ECONNREFUSED'));
    const result = await registerNode(makeRegisterArgs());
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/network error/i);
  });
});

describe('registerNode — success with nodeId and authToken', () => {
  it('returns nodeId and authToken from a successful response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        node_id: 'node-abc',
        auth_token: 'tok-xyz',
        message: 'registered',
      }),
    });
    const result = await registerNode(makeRegisterArgs());
    expect(result.success).toBe(true);
    expect(result.nodeId).toBe('node-abc');
    expect(result.authToken).toBe('tok-xyz');
  });

  it('sends the wallet_address / node_type / verification_method in the body', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });
    await registerNode(makeRegisterArgs());
    const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string);
    expect(url).toContain('/nodes/register');
    expect(body.wallet_address).toBe('0xabc123');
    expect(body.node_type).toBe('bsc-full');
    expect(body.verification_method).toBe('exposed-rpc');
    expect(body.rpc_endpoint).toBe('http://node:8545');
  });
});

// ─────────────────────────────────────────────────────────────
// getNetworkStats — uncovered field fallbacks
// ─────────────────────────────────────────────────────────────

describe('getNetworkStats — field fallbacks', () => {
  it('activeNodes falls back to totalNodes when absent', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        // no activeNodes key in data
        data: { totalNodes: 5, totalVerifications: 100, totalPoints: 1000 },
      }),
    });
    const stats = await getNetworkStats();
    expect(stats.activeNodes).toBe(5); // should equal totalNodes
  });

  it('verificationSuccessRate defaults to 98.7 when not in response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { totalNodes: 1 },
      }),
    });
    const stats = await getNetworkStats();
    expect(stats.verificationSuccessRate).toBeCloseTo(98.7);
  });
});

// ─────────────────────────────────────────────────────────────
// getLeaderboard — antiCheatStatus and points aliases
// ─────────────────────────────────────────────────────────────

describe('getLeaderboard — antiCheatStatus and points aliases', () => {
  it('maps anti_cheat_status field when antiCheatStatus absent', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [{ address: '0xaaa', anti_cheat_status: 'Warning', total_verifications: 10, uptime_hours: 1, points: 100 }],
      }),
    });
    const lb = await getLeaderboard();
    expect(lb[0].antiCheatStatus).toBe('Warning');
  });

  it('maps totalPoints (backend key) as node.points', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [{ address: '0xbbb', totalPoints: 500, total_verifications: 20, uptime_hours: 2 }],
      }),
    });
    const lb = await getLeaderboard();
    expect(lb[0].points).toBe(500);
  });

  it('defaults antiCheatStatus to Clean when both keys absent', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [{ address: '0xccc', total_verifications: 5 }],
      }),
    });
    const lb = await getLeaderboard();
    expect(lb[0].antiCheatStatus).toBe('Clean');
  });
});

// ─────────────────────────────────────────────────────────────
// getNodeInfo — registeredAt and uptime fields
// ─────────────────────────────────────────────────────────────

describe('getNodeInfo — registeredAt and uptime', () => {
  it('sets registeredAt from created_at field', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { address: '0xnode', is_active: true, points: 0, created_at: '2024-01-15T00:00:00Z' },
      }),
    });
    const info = await getNodeInfo('0xnode');
    expect(info.registeredAt).toBe('2024-01-15T00:00:00Z');
  });

  it('hardcodes uptime to 99.0 for active nodes (current implementation)', async () => {
    // NOTE: this test documents the current (hardcoded) behaviour. if the API
    // ever returns real uptime, this test should be updated to assert mapping.
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { address: '0xnode', is_active: true, points: 0 },
      }),
    });
    const info = await getNodeInfo('0xnode');
    expect(info.uptime).toBe(99.0);
  });
});
