/**
 * Tests for src/lib/wallet.tsx
 *
 * Setup (one-time):
 *   npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom
 *   Add to package.json: "test": "vitest", "test:run": "vitest run"
 *   Add to vite.config.ts: test: { environment: 'jsdom', globals: true }
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { WalletProvider, useWallet } from '../src/lib/wallet';

vi.mock('ethers', () => ({
  ethers: {
    BrowserProvider: vi.fn().mockImplementation(() => ({
      getSigner: vi.fn().mockResolvedValue({ _isSigner: true }),
    })),
  },
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

function makeEthereum(overrides: Record<string, unknown> = {}) {
  return {
    request: vi.fn(),
    on: vi.fn(),
    removeListener: vi.fn(),
    ...overrides,
  };
}

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(WalletProvider, null, children);

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  // @ts-expect-error intentional
  delete window.ethereum;
});

// ─── useWallet hook guard ─────────────────────────────────────────────────────

describe('useWallet — guard', () => {
  it('throws when used outside WalletProvider', () => {
    expect(() => renderHook(() => useWallet())).toThrow(
      'useWallet must be used within a WalletProvider',
    );
  });
});

// ─── initial state ─────────────────────────────────────────────────────────

describe('WalletProvider — initial state', () => {
  it('starts with null address and signer when no ethereum', () => {
    const { result } = renderHook(() => useWallet(), { wrapper });
    expect(result.current.address).toBeNull();
    expect(result.current.signer).toBeNull();
    expect(result.current.isConnecting).toBe(false);
  });

  it('auto-reconnects when ethereum returns existing accounts', async () => {
    window.ethereum = makeEthereum({
      request: vi.fn().mockResolvedValue(['0xAutoReconnect']),
    });
    const { result } = renderHook(() => useWallet(), { wrapper });
    await act(async () => {});
    expect(result.current.address).toBe('0xAutoReconnect');
  });

  it('skips auto-reconnect when walletDisconnected flag is set', async () => {
    localStorage.setItem('walletDisconnected', 'true');
    window.ethereum = makeEthereum({
      request: vi.fn().mockResolvedValue(['0xShouldNotAppear']),
    });
    const { result } = renderHook(() => useWallet(), { wrapper });
    await act(async () => {});
    expect(result.current.address).toBeNull();
  });

  it('stays null when ethereum.request rejects during auto-reconnect', async () => {
    window.ethereum = makeEthereum({
      request: vi.fn().mockRejectedValue(new Error('locked')),
    });
    const { result } = renderHook(() => useWallet(), { wrapper });
    await act(async () => {});
    expect(result.current.address).toBeNull();
  });
});

// ─── connectWallet ────────────────────────────────────────────────────────────

describe('connectWallet', () => {
  it('sets address and clears disconnect flag on success', async () => {
    localStorage.setItem('walletDisconnected', 'true');
    window.ethereum = makeEthereum({
      request: vi.fn().mockResolvedValue(['0xConnected']),
    });
    const { result } = renderHook(() => useWallet(), { wrapper });
    await act(async () => { await result.current.connectWallet(); });
    expect(result.current.address).toBe('0xConnected');
    expect(localStorage.getItem('walletDisconnected')).toBeNull();
  });

  it('opens MetaMask download and shows error when no ethereum', async () => {
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useWallet(), { wrapper });
    await act(async () => { await result.current.connectWallet(); });
    expect(toast.error).toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining('metamask'), '_blank');
    expect(result.current.address).toBeNull();
  });

  it('shows rejection toast for error code 4001', async () => {
    window.ethereum = makeEthereum({
      request: vi.fn().mockRejectedValue({ code: 4001 }),
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useWallet(), { wrapper });
    await act(async () => { await result.current.connectWallet(); });
    expect(toast.error).toHaveBeenCalledWith('Connection request rejected');
    expect(result.current.isConnecting).toBe(false);
  });

  it('shows generic error for non-4001 failures', async () => {
    window.ethereum = makeEthereum({
      request: vi.fn().mockRejectedValue({ code: 999 }),
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useWallet(), { wrapper });
    await act(async () => { await result.current.connectWallet(); });
    expect(toast.error).toHaveBeenCalledWith('Failed to connect wallet');
  });

  it('isConnecting is true during the request and false after', async () => {
    let resolve!: (v: string[]) => void;
    window.ethereum = makeEthereum({
      request: vi.fn().mockImplementation(
        () => new Promise((r) => { resolve = r; }),
      ),
    });
    const { result } = renderHook(() => useWallet(), { wrapper });
    act(() => { void result.current.connectWallet(); });
    expect(result.current.isConnecting).toBe(true);
    await act(async () => { resolve(['0xDone']); });
    expect(result.current.isConnecting).toBe(false);
  });
});

// ─── disconnectWallet ─────────────────────────────────────────────────────────

describe('disconnectWallet', () => {
  it('clears address and signer, sets disconnect flag', async () => {
    window.ethereum = makeEthereum({
      request: vi.fn().mockResolvedValue(['0xConnected']),
    });
    const { result } = renderHook(() => useWallet(), { wrapper });
    await act(async () => { await result.current.connectWallet(); });
    act(() => { result.current.disconnectWallet(); });
    expect(result.current.address).toBeNull();
    expect(result.current.signer).toBeNull();
    expect(localStorage.getItem('walletDisconnected')).toBe('true');
  });
});

// ─── changeWallet ─────────────────────────────────────────────────────────────

describe('changeWallet', () => {
  it('calls wallet_requestPermissions with eth_accounts param', async () => {
    const requestMock = vi.fn().mockResolvedValue(undefined);
    window.ethereum = makeEthereum({ request: requestMock });
    const { result } = renderHook(() => useWallet(), { wrapper });
    await act(async () => { await result.current.changeWallet(); });
    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'wallet_requestPermissions' }),
    );
  });

  it('shows rejection toast for error code 4001', async () => {
    window.ethereum = makeEthereum({
      request: vi.fn().mockRejectedValue({ code: 4001 }),
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useWallet(), { wrapper });
    await act(async () => { await result.current.changeWallet(); });
    expect(toast.error).toHaveBeenCalledWith('Wallet change request rejected');
  });

  it('shows error when ethereum is absent', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useWallet(), { wrapper });
    await act(async () => { await result.current.changeWallet(); });
    expect(toast.error).toHaveBeenCalled();
  });
});

// ─── accountsChanged event ────────────────────────────────────────────────────

describe('accountsChanged event', () => {
  it('updates address when a new account is received', async () => {
    let handler!: (accounts: string[]) => void;
    window.ethereum = makeEthereum({
      request: vi.fn().mockResolvedValue([]),
      on: vi.fn().mockImplementation((event: string, cb: unknown) => {
        if (event === 'accountsChanged') handler = cb as typeof handler;
      }),
    });
    const { result } = renderHook(() => useWallet(), { wrapper });
    await act(async () => { handler(['0xNewAccount']); });
    expect(result.current.address).toBe('0xNewAccount');
  });

  it('clears address and signer when accounts list becomes empty', async () => {
    let handler!: (accounts: string[]) => void;
    window.ethereum = makeEthereum({
      request: vi.fn().mockResolvedValue(['0xOld']),
      on: vi.fn().mockImplementation((event: string, cb: unknown) => {
        if (event === 'accountsChanged') handler = cb as typeof handler;
      }),
    });
    const { result } = renderHook(() => useWallet(), { wrapper });
    await act(async () => {});
    await act(async () => { handler([]); });
    expect(result.current.address).toBeNull();
    expect(result.current.signer).toBeNull();
  });
});
