import type { Metadata } from 'next';
import { BentoDashboard } from '@/components/BentoDashboard';

export const metadata: Metadata = {
  title: 'Merchant Vault — Tèmi',
  description: 'Your dual reserve, asset registry and emergency settlement on Creditcoin cc3-testnet.',
};

export default function MerchantVaultPage() {
  return <BentoDashboard />;
}
