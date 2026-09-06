import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { RegionProvider } from '@/components/RegionProvider';

export const metadata: Metadata = {
  title: 'Tèmi — Emergency Micro-Liquidity',
  description:
    'Non-custodial, hardware-attested emergency micro-liquidity for emerging-market SMEs, settled on Creditcoin cc3-testnet.',
};

export const viewport: Viewport = {
  themeColor: '#F4F1EA',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-dvh bg-paper text-ink antialiased">
        <RegionProvider>{children}</RegionProvider>
      </body>
    </html>
  );
}
