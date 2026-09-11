'use client';

import { useEffect, useState } from 'react';
import { Fingerprint, KeyRound, Loader2, LogOut, ShieldCheck, Store, Wallet } from 'lucide-react';
import { creditcoinTestnet, blockscoutAddress } from '@/lib/chains';
import { truncateAddress } from '@/lib/format';
import type { useMerchantAccount } from '@/hooks/useMerchantAccount';
import { Badge, Button, Modal, Notice, Tabs } from './ui/Primitives';
import { PinField } from './PinPad';

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
  const [pin, setPin] = useState('');

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
        account.record ? (
          <div className="space-y-4">
            <div className="border border-hairline bg-paper-raised px-3.5 py-3">
              <p className="eyebrow mb-1">Vault on this device</p>
              <p className="text-[12.5px] font-medium text-ink">{account.record.businessName}</p>
              <p className="tabular mt-0.5 text-[10.5px] text-slate-soft">
                {account.record.phoneE164} · {truncateAddress(account.record.address)}
              </p>
            </div>

            {account.biometricArmed ? (
              <Button
                variant="outline"
                block
                disabled={account.busy}
                onClick={() => void account.unlockWithTouch()}
              >
                <Fingerprint size={14} strokeWidth={1.75} />
                Unlock with fingerprint
              </Button>
            ) : null}

            <PinField
              label={account.biometricArmed ? 'Or enter your 4-digit PIN' : 'Enter your 4-digit PIN'}
              value={pin}
              onChange={setPin}
              onComplete={(value) => void account.unlockWithPin(value)}
              invalid={Boolean(account.error)}
              autoFocus={!account.biometricArmed}
            />

            {account.error ? (
              <Notice tone="rust" title={account.error.title}>{account.error.detail}</Notice>
            ) : null}

            <Button
              block
              disabled={pin.length !== 4 || account.busy}
              onClick={() => void account.unlockWithPin(pin)}
            >
              {account.busy ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} strokeWidth={1.75} />}
              {account.busy ? 'Unlocking…' : 'Unlock my vault'}
            </Button>

            <button
              onClick={() => void account.forget()}
              className="focus-ring w-full text-center text-[10.5px] text-slate-soft underline underline-offset-2"
            >
              Restore a different vault on this device
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-2.5">
              <Store size={15} className="mt-[2px] shrink-0 text-slate-soft" strokeWidth={1.75} />
              <p className="text-[12.5px] leading-relaxed text-slate-strong">
                Your vault opens with your mobile number and a 4-digit PIN. No seed phrase, no
                extension, and it works on any phone — a fingerprint sensor is optional, not
                required.
              </p>
            </div>

            {/* On a second handset this same flow is a restore, not a new vault — the key is
                derived from the number and PIN, so identical inputs reach the identical account.
                Calling it "set-up" made merchants think they were about to create a second one
                and lose the first. */}
            <Notice tone="neutral" title="New here, or moving to a new phone?" icon={<ShieldCheck size={12} />}>
              Same steps either way. Verify your number and enter your PIN: if you have a vault,
              this opens it with everything in it; if you do not, this creates one. Your key is
              derived from those two things, never stored, so the same pair always reaches the
              same vault.
            </Notice>

            <Button block onClick={onClose}>
              Continue
            </Button>
          </div>
        )
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

            {account.kind === 'merchant' && account.record ? (
              <div className="mb-2.5">
                <div className="mb-1 flex items-center gap-1.5">
                  <ShieldCheck size={11} className="text-moss" strokeWidth={2} />
                  <span className="text-[10.5px] font-medium text-moss">
                    Secured by your number and PIN
                  </span>
                </div>
                <p className="tabular text-[10px] leading-snug text-slate-soft">
                  {account.record.phoneE164}
                </p>
                <p className="mt-0.5 text-[10px] leading-snug text-slate-soft">
                  Restorable on any phone with the same number and PIN.
                </p>
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
