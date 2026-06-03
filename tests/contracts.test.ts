/**
 * Tests for src/lib/contracts.ts — zero coverage today.
 *
 * All on-chain calls are mocked via ethers contract stubs so no wallet or
 * node is needed.  Tests are grouped by function.
 *
 * Setup (same as api.test.ts):
 *   npm i -D vitest @testing-library/react jsdom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  checkNetwork,
  switchToBSCTestnet,
  registerNodeOnChain,
  unstakeNode,
  getNodeInfoFromChain,
  getPointsBalance,
  getMinimumStake,
  NETWORK_ID,
} from '../src/lib/contracts';

// ─── shared mocks ────────────────────────────────────────────

function makeProvider(chainId: number) {
  return {
    getNetwork: vi.fn().mockResolvedValue({ chainId: BigInt(chainId) }),
  };
}

function makeSigner(contractMethods: Record<string, unknown> = {}) {
  return {
    getAddress: vi.fn().mockResolvedValue('0xsigner'),
    // the ethers.Contract constructor will use provider from the signer
  };
}

// ethers.Contract is called with (address, abi, signerOrProvider).
// We stub the module so tests don't need a real provider.
vi.mock('../src/lib/contracts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/lib/contracts')>();
  return actual; // re-export real; individual contract stubs go per-test via vi.mock('ethers')
});

// ─────────────────────────────────────────────────────────────
// checkNetwork
// ─────────────────────────────────────────────────────────────

describe('checkNetwork', () => {
  it('returns true when chainId matches NETWORK_ID', async () => {
    const provider = makeProvider(NETWORK_ID);
    const result = await checkNetwork(provider as any);
    expect(result).toBe(true);
  });

  it('returns false when chainId differs', async () => {
    const provider = makeProvider(1); // Ethereum mainnet
    const result = await checkNetwork(provider as any);
    expect(result).toBe(false);
  });

  it('returns false and does not throw when provider.getNetwork rejects', async () => {
    const provider = { getNetwork: vi.fn().mockRejectedValue(new Error('rpc error')) };
    const result = await checkNetwork(provider as any);
    expect(result).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// switchToBSCTestnet
// ─────────────────────────────────────────────────────────────

describe('switchToBSCTestnet', () => {
  beforeEach(() => {
    // reset window.ethereum before each test
    vi.stubGlobal('window', { ethereum: undefined });
  });

  it('returns true when wallet_switchEthereumChain succeeds', async () => {
    vi.stubGlobal('window', {
      ethereum: { request: vi.fn().mockResolvedValue(null) },
    });
    const result = await switchToBSCTestnet();
    expect(result).toBe(true);
  });

  it('calls wallet_addEthereumChain when chain not found (4902)', async () => {
    const request = vi
      .fn()
      .mockRejectedValueOnce({ code: 4902 })   // switch fails
      .mockResolvedValueOnce(null);             // add succeeds
    vi.stubGlobal('window', { ethereum: { request } });
    const result = await switchToBSCTestnet();
    expect(result).toBe(true);
    expect(request).toHaveBeenCalledTimes(2);
    expect(request.mock.calls[1][0].method).toBe('wallet_addEthereumChain');
  });

  it('returns false when adding chain also fails', async () => {
    const request = vi
      .fn()
      .mockRejectedValueOnce({ code: 4902 })
      .mockRejectedValueOnce(new Error('user cancelled'));
    vi.stubGlobal('window', { ethereum: { request } });
    const result = await switchToBSCTestnet();
    expect(result).toBe(false);
  });

  it('returns false on non-4902 switch error', async () => {
    const request = vi.fn().mockRejectedValueOnce({ code: 4001 });
    vi.stubGlobal('window', { ethereum: { request } });
    const result = await switchToBSCTestnet();
    expect(result).toBe(false);
  });

  it('returns false when window.ethereum is undefined', async () => {
    vi.stubGlobal('window', { ethereum: undefined });
    // should not throw
    const result = await switchToBSCTestnet();
    expect(result).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// registerNodeOnChain
// ─────────────────────────────────────────────────────────────

describe('registerNodeOnChain', () => {
  it('returns success with txHash on happy path', async () => {
    const tx = { hash: '0xtx', wait: vi.fn().mockResolvedValue({}) };
    const contract = { registerNode: vi.fn().mockResolvedValue(tx) };
    // inject via getStakingContract stub (we mock ethers.Contract at the module level below)
    vi.mock('ethers', async (importOriginal) => {
      const real = await importOriginal<typeof import('ethers')>();
      return {
        ...real,
        Contract: vi.fn().mockReturnValue(contract),
      };
    });
    const signer = makeSigner();
    const result = await registerNodeOnChain(signer as any, 'node-1', '0.1');
    expect(result.success).toBe(true);
    expect(result.txHash).toBe('0xtx');
  });

  it('returns failure with error message when contract call throws', async () => {
    vi.mock('ethers', async (importOriginal) => {
      const real = await importOriginal<typeof import('ethers')>();
      const badContract = { registerNode: vi.fn().mockRejectedValue(new Error('insufficient funds')) };
      return { ...real, Contract: vi.fn().mockReturnValue(badContract) };
    });
    const result = await registerNodeOnChain(makeSigner() as any, 'node-1', '0.1');
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────
// unstakeNode
// ─────────────────────────────────────────────────────────────

describe('unstakeNode', () => {
  it('returns stake amount and txHash on success', async () => {
    const tx = { hash: '0xunstake', wait: vi.fn().mockResolvedValue({}) };
    const contract = {
      nodes: vi.fn().mockResolvedValue({ stakedAmount: BigInt('100000000000000000') }), // 0.1 BNB
      unstake: vi.fn().mockResolvedValue(tx),
    };
    vi.mock('ethers', async (importOriginal) => {
      const real = await importOriginal<typeof import('ethers')>();
      return { ...real, Contract: vi.fn().mockReturnValue(contract) };
    });
    const signer = { getAddress: vi.fn().mockResolvedValue('0xsigner') };
    const result = await unstakeNode(signer as any);
    expect(result.success).toBe(true);
    expect(result.txHash).toBe('0xunstake');
    expect(result.amount).toBe('0.1');
  });

  it('returns failure when unstake throws', async () => {
    vi.mock('ethers', async (importOriginal) => {
      const real = await importOriginal<typeof import('ethers')>();
      const c = {
        nodes: vi.fn().mockResolvedValue({ stakedAmount: BigInt(0) }),
        unstake: vi.fn().mockRejectedValue(new Error('not registered')),
      };
      return { ...real, Contract: vi.fn().mockReturnValue(c) };
    });
    const signer = { getAddress: vi.fn().mockResolvedValue('0xsigner') };
    const result = await unstakeNode(signer as any);
    expect(result.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// getNodeInfoFromChain
// ─────────────────────────────────────────────────────────────

describe('getNodeInfoFromChain', () => {
  it('maps chain struct to plain object', async () => {
    const node = {
      nodeId: 'n1',
      stakeAmount: BigInt('100000000000000000'),
      isActive: true,
      registeredAt: BigInt(1_700_000_000),
    };
    vi.mock('ethers', async (importOriginal) => {
      const real = await importOriginal<typeof import('ethers')>();
      return {
        ...real,
        Contract: vi.fn().mockReturnValue({ nodes: vi.fn().mockResolvedValue(node) }),
      };
    });
    const result = await getNodeInfoFromChain(makeProvider(97) as any, '0xaddr');
    expect(result).not.toBeNull();
    expect(result.nodeId).toBe('n1');
    expect(result.isActive).toBe(true);
  });

  it('returns null on contract error', async () => {
    vi.mock('ethers', async (importOriginal) => {
      const real = await importOriginal<typeof import('ethers')>();
      return {
        ...real,
        Contract: vi.fn().mockReturnValue({ nodes: vi.fn().mockRejectedValue(new Error('reverted')) }),
      };
    });
    const result = await getNodeInfoFromChain(makeProvider(97) as any, '0xaddr');
    expect(result).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────
// getPointsBalance
// ─────────────────────────────────────────────────────────────

describe('getPointsBalance', () => {
  it('returns balance as string on success', async () => {
    vi.mock('ethers', async (importOriginal) => {
      const real = await importOriginal<typeof import('ethers')>();
      return {
        ...real,
        Contract: vi.fn().mockReturnValue({ getPoints: vi.fn().mockResolvedValue(BigInt(42)) }),
      };
    });
    const bal = await getPointsBalance(makeProvider(97) as any, '0xaddr');
    expect(bal).toBe('42');
  });

  it('returns "0" on error', async () => {
    vi.mock('ethers', async (importOriginal) => {
      const real = await importOriginal<typeof import('ethers')>();
      return {
        ...real,
        Contract: vi.fn().mockReturnValue({ getPoints: vi.fn().mockRejectedValue(new Error('reverted')) }),
      };
    });
    const bal = await getPointsBalance(makeProvider(97) as any, '0xaddr');
    expect(bal).toBe('0');
  });
});

// ─────────────────────────────────────────────────────────────
// getMinimumStake
// ─────────────────────────────────────────────────────────────

describe('getMinimumStake', () => {
  it('returns formatted ETH string on success', async () => {
    vi.mock('ethers', async (importOriginal) => {
      const real = await importOriginal<typeof import('ethers')>();
      return {
        ...real,
        Contract: vi.fn().mockReturnValue({
          minimumStake: vi.fn().mockResolvedValue(BigInt('100000000000000000')), // 0.1 BNB
        }),
      };
    });
    const min = await getMinimumStake(makeProvider(97) as any);
    expect(min).toBe('0.1');
  });

  it('falls back to "0.1" on error', async () => {
    vi.mock('ethers', async (importOriginal) => {
      const real = await importOriginal<typeof import('ethers')>();
      return {
        ...real,
        Contract: vi.fn().mockReturnValue({
          minimumStake: vi.fn().mockRejectedValue(new Error('reverted')),
        }),
      };
    });
    const min = await getMinimumStake(makeProvider(97) as any);
    expect(min).toBe('0.1');
  });
});
