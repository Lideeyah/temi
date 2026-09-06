'use client';

import { useEffect, useState } from 'react';
import {
  Fingerprint,
  Loader2,
  LogOut,
  ShieldCheck,
  Store,
  TriangleAlert,
  Wallet,
} from 'lucide-react';
import { creditcoinTestnet, blockscoutAddress } from '@/lib/chains';
import { truncateAddress } from '@/lib/format';
import type { useMerchantAccount } from '@/hooks/useMerchantAccount';
import { Badge, Button, Field, Modal, Notice, Tabs, TextInput } from './ui/Primitives';

type TabId = 'merchant' | 'wallet';

/**
 * Account provisioning, not "connect wallet".
 *
 * The default tab asks a market trader for their business name and a fingerprint. The second
 * exists so a judge can drive the same contracts from a funded MetaMask account. Both end at
 * the same place; only the framing differs, because the two audiences are genuinely different
 * people with different questions.
 */
export function AccountDrawer({
  open,
  onClose,
  account,
  reason,
}: {
  open: boolean;
  onClose: () => void;
  account: ReturnType<typeof useMerchantAccount>;
  /** What the merchant was trying to do when this appeared. */
  reason?: string;
}) {
  const [tab, setTab] = useState<TabId>('merchant');
  const [label, setLabel] = useState('');

  // Close as soon as an account is live — nobody wants to dismiss a dialog they are done with.
  useEffect(() => {
    if (open && account.connected) onClose();
  }, [open, account.connected, onClose]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow={reason ?? 'Merchant account'}
      title="Open your vault"
      width="max-w-md"
    >
      <div className="-mx-5 -mt-5 mb-5">
        <Tabs
          tabs={[
            { id: 'merchant', label: 'SME direct', hint: 'Phone or fingerprint' },
            { id: 'wallet', label: 'Web3 wallet', hint: 'For developers' },
          ]}
          active={tab}
          onChange={(id) => setTab(id as TabId)}
        />
      </div>

      {tab === 'merchant' ? (
        <div className="space-y-4">
          <div className="flex items-start gap-2.5">
            <Store size={15} className="mt-[2px] shrink-0 text-slate-soft" strokeWidth={1.75} />
            <p className="text-[12.5px] leading-relaxed text-slate-strong">
              Your vault opens with your business name and the fingerprint you already use to
              unlock this phone. There is no seed phrase to write down and nothing to install.
            </p>
          </div>

          {account.record ? (
            <div className="border border-hairline bg-paper-raised px-3.5 py-3">
              <p className="eyebrow mb-1.5">Existing vault on this device</p>
              <p className="tabular text-[12px] font-medium text-ink">{account.record.label}</p>
              <p className="tabular mt-0.5 text-[10.5px] text-slate-soft">
                {truncateAddress(account.record.address)}
              </p>
            </div>
          ) : (
            <Field
              label="Business name"
              hint="Shown on your phone's passkey prompt so you recognise it later."
            >
              <TextInput
                mono={false}
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                placeholder="e.g. Adeola Electronics, Balogun"
                autoFocus
              />
            </Field>
          )}

          {/* Once an account exists, report the protection it ACTUALLY got. Whether the
              authenticator supports key derivation is only knowable after the fact, and
              promising biometric encryption to someone who did not receive it is the kind of
              claim that matters most to the person least able to check it. */}
          {account.protection ? (
            <Notice
              tone={account.protection.strong ? 'moss' : 'ochre'}
              title={account.protection.title}
              icon={account.protection.strong ? <Fingerprint size={12} /> : <TriangleAlert size={12} />}
            >
              {account.protection.detail}
            </Notice>
          ) : account.biometricAvailable ? (
            <Notice tone="neutral" title="This device has a biometric sensor" icon={<Fingerprint size={12} />}>
              Your vault will ask for it. If this browser also supports deriving a key from that
              biometric, your account key is encrypted with it — Tèmi will tell you which
              protection you ended up with once the vault exists.
            </Notice>
          ) : (
            <Notice tone="ochre" title="No biometric sensor detected" icon={<TriangleAlert size={12} />}>
              Your vault will still open, but the key will sit on this device behind a passkey
              check rather than encrypted by your fingerprint. Prefer a phone for real use.
            </Notice>
          )}

          {account.error ? (
            <Notice tone="rust" title={account.error.title}>{account.error.detail}</Notice>
          ) : null}

          <Button
            block
            disabled={account.busy || (!account.record && !label.trim())}
            onClick={() => void account.openMerchantVault(label)}
          >
            {account.busy ? <Loader2 size={14} className="animate-spin" /> : <Fingerprint size={14} strokeWidth={1.75} />}
            {account.busy
              ? 'Waiting for your fingerprint…'
              : account.record
                ? 'Unlock my vault'
                : 'Create my vault'}
          </Button>

          <p className="text-center text-[10px] leading-relaxed text-slate-soft">
            Gas on cc3-testnet is covered for you. You never need to hold a token to file a claim.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-start gap-2.5">
            <Wallet size={15} className="mt-[2px] shrink-0 text-slate-soft" strokeWidth={1.75} />
            <p className="text-[12.5px] leading-relaxed text-slate-strong">
              Connect an injected EVM wallet to drive the same contracts from your own funded
              account. Tèmi will add Creditcoin cc3-testnet if your wallet does not have it.
            </p>
          </div>

          <div className="border border-hairline bg-paper-raised px-3.5 py-3">
            <p className="eyebrow mb-2">Network</p>
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] text-slate-soft">Chain</span>
              <span className="tabular text-[11px] text-ink">{creditcoinTestnet.name}</span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-[11px] text-slate-soft">Chain ID</span>
              <span className="tabular text-[11px] text-ink">{creditcoinTestnet.id}</span>
            </div>
          </div>

          {!account.injected.hasProvider ? (
            <Notice tone="ochre" title="No injected wallet detected">
              Install MetaMask, Rabby or OKX, or use the SME direct path — it needs no extension.
            </Notice>
          ) : null}

          {account.injected.error ? (
            <Notice tone="rust" title={account.injected.error} />
          ) : null}

          <Button
            block
            variant="outline"
            disabled={account.injected.connecting || !account.injected.hasProvider}
            onClick={() => void account.injected.connect()}
          >
            {account.injected.connecting ? <Loader2 size={14} className="animate-spin" /> : <Wallet size={14} strokeWidth={1.75} />}
            {account.injected.connecting ? 'Connecting…' : 'Connect EVM wallet'}
          </Button>
        </div>
      )}
    </Modal>
  );
}

/**
 * The header pill.
 *
 * Deliberately quiet. For a merchant it should read as "I am signed in", not as a crypto
 * control surface; for a judge it needs to say which chain and which address at a glance.
 */
export function AccountPill({
  account,
  onOpen,
}: {
  account: ReturnType<typeof useMerchantAccount>;
  onOpen: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  if (!account.connected || !account.address) {
    return (
      <button
        onClick={onOpen}
        className="focus-ring inline-flex items-center gap-1.5 rounded-[3px] border border-hairline-strong px-3 py-[6px] text-[12px] font-medium text-ink transition-colors hover:bg-[rgba(31,36,47,0.04)]"
      >
        <Store size={13} strokeWidth={1.75} />
        Access Merchant Vault
      </button>
    );
  }

  const onCorrectChain = account.kind === 'merchant' || account.injected.onCorrectChain;

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="focus-ring inline-flex items-center gap-2 rounded-[3px] border border-hairline-strong px-2.5 py-[6px] transition-colors hover:bg-[rgba(31,36,47,0.04)]"
      >
        <span
          className={`inline-block size-[6px] shrink-0 rounded-[1px] ${onCorrectChain ? 'bg-moss' : 'bg-rust'}`}
        />
        {account.kind === 'merchant' ? (
          <Fingerprint size={12} className="text-slate-strong" strokeWidth={1.75} />
        ) : (
          <Wallet size={12} className="text-slate-strong" strokeWidth={1.75} />
        )}
        <span className="tabular text-[11px] text-ink">{truncateAddress(account.address)}</span>
      </button>

      {menuOpen ? (
        <>
          <button
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="card absolute right-0 top-[calc(100%+6px)] z-50 w-[248px] p-3">
            <p className="eyebrow mb-1.5">
              {account.kind === 'merchant' ? 'Merchant vault' : 'Injected wallet'}
            </p>

            {account.kind === 'merchant' && account.protection ? (
              <div className="mb-2.5">
                <div className="mb-1 flex items-center gap-1.5">
                  <ShieldCheck
                    size={11}
                    className={account.protection.strong ? 'text-moss' : 'text-ochre'}
                    strokeWidth={2}
                  />
                  <span
                    className={`text-[10.5px] font-medium ${account.protection.strong ? 'text-moss' : 'text-ochre'}`}
                  >
                    {account.protection.title}
                  </span>
                </div>
                <p className="text-[10px] leading-snug text-slate-soft">{account.protection.detail}</p>
              </div>
            ) : null}

            <div className="mb-2 border-t border-hairline pt-2">
              <Badge tone={onCorrectChain ? 'moss' : 'rust'} className="w-full justify-center">
                cc3-testnet · {creditcoinTestnet.id}
              </Badge>
            </div>

            {account.sponsorship?.sponsored ? (
              <p className="mb-2 text-[10px] leading-snug text-moss">
                Gas sponsored: {account.sponsorship.amount} tCTC. You do not need to hold a token.
              </p>
            ) : null}

            <a
              href={blockscoutAddress(account.address)}
              target="_blank"
              rel="noreferrer"
              className="focus-ring mb-1.5 block text-[10.5px] text-ink underline underline-offset-2"
            >
              View on Blockscout
            </a>

            {account.kind === 'merchant' ? (
              <button
                onClick={() => {
                  account.lock();
                  setMenuOpen(false);
                }}
                className="focus-ring inline-flex w-full items-center gap-1.5 rounded-[2px] border border-hairline px-2 py-1.5 text-[10.5px] text-slate-strong transition-colors hover:bg-[rgba(31,36,47,0.04)]"
              >
                <LogOut size={10} strokeWidth={2} />
                Lock vault
              </button>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
