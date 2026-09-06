'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createWalletClient,
  custom,
  type Address,
  type EIP1193Provider,
  type WalletClient,
} from 'viem';
import { creditcoinTestnet } from '@/lib/chains';

declare global {
  interface Window {
    ethereum?: EIP1193Provider;
  }
}

export interface WalletState {
  address: Address | null;
  chainId: number | null;
  connecting: boolean;
  error: string | null;
  hasProvider: boolean;
  onCorrectChain: boolean;
}

const CHAIN_ID_HEX = `0x${creditcoinTestnet.id.toString(16)}` as const;

/**
 * Minimal EIP-1193 wallet binding.
 *
 * Deliberately thin: Tèmi has exactly one chain, so there is no connector registry to maintain.
 * The one piece of real work here is `ensureChain`, which adds cc3-testnet to the wallet when
 * the user has never seen it — most operators will not have it configured.
 */
export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    chainId: null,
    connecting: false,
    error: null,
    hasProvider: false,
    onCorrectChain: false,
  });

  useEffect(() => {
    const provider = window.ethereum;
    if (!provider) {
      setState((s) => ({ ...s, hasProvider: false }));
      return;
    }
    setState((s) => ({ ...s, hasProvider: true }));

    const sync = async () => {
      const [accounts, chainId] = await Promise.all([
        provider.request({ method: 'eth_accounts' }) as Promise<Address[]>,
        provider.request({ method: 'eth_chainId' }) as Promise<string>,
      ]);
      const numericChainId = Number.parseInt(chainId, 16);
      setState((s) => ({
        ...s,
        address: accounts[0] ?? null,
        chainId: numericChainId,
        onCorrectChain: numericChainId === creditcoinTestnet.id,
      }));
    };
    void sync();

    const onAccounts = (accounts: unknown) => {
      const list = accounts as Address[];
      setState((s) => ({ ...s, address: list[0] ?? null }));
    };
    const onChain = (chainId: unknown) => {
      const numeric = Number.parseInt(chainId as string, 16);
      setState((s) => ({ ...s, chainId: numeric, onCorrectChain: numeric === creditcoinTestnet.id }));
    };

    provider.on?.('accountsChanged', onAccounts);
    provider.on?.('chainChanged', onChain);
    return () => {
      provider.removeListener?.('accountsChanged', onAccounts);
      provider.removeListener?.('chainChanged', onChain);
    };
  }, []);

  const ensureChain = useCallback(async () => {
    const provider = window.ethereum;
    if (!provider) return;
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CHAIN_ID_HEX }],
      });
    } catch {
      // 4902 — the wallet has never heard of cc3-testnet. Register it, then switch.
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: CHAIN_ID_HEX,
            chainName: creditcoinTestnet.name,
            nativeCurrency: creditcoinTestnet.nativeCurrency,
            rpcUrls: [...creditcoinTestnet.rpcUrls.default.http],
            blockExplorerUrls: [creditcoinTestnet.blockExplorers.default.url],
          },
        ],
      });
    }
  }, []);

  const connect = useCallback(async () => {
    const provider = window.ethereum;
    if (!provider) {
      setState((s) => ({
        ...s,
        error: 'No EVM wallet detected. Install a browser wallet to hold your own reserve.',
      }));
      return;
    }

    setState((s) => ({ ...s, connecting: true, error: null }));
    try {
      const accounts = (await provider.request({ method: 'eth_requestAccounts' })) as Address[];
      await ensureChain();
      const chainId = Number.parseInt(
        (await provider.request({ method: 'eth_chainId' })) as string,
        16,
      );
      setState({
        address: accounts[0] ?? null,
        chainId,
        connecting: false,
        error: null,
        hasProvider: true,
        onCorrectChain: chainId === creditcoinTestnet.id,
      });
    } catch (cause) {
      setState((s) => ({
        ...s,
        connecting: false,
        error: cause instanceof Error ? cause.message : 'Wallet connection refused',
      }));
    }
  }, [ensureChain]);

  const walletClient: WalletClient | null = useMemo(() => {
    if (!state.address || typeof window === 'undefined' || !window.ethereum) return null;
    return createWalletClient({
      account: state.address,
      chain: creditcoinTestnet,
      transport: custom(window.ethereum),
    });
  }, [state.address]);

  return { ...state, connect, ensureChain, walletClient };
}
