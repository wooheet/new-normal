import type { Metadata } from 'next';
import './globals.css';
import { Nav } from '@/components/layout/Nav';

export const metadata: Metadata = {
  title: 'OTR Universe — Community-Governed World',
  description: 'A living world where every story is decided by its community. Write lore, vote on canon, shape the universe.',
  openGraph: {
    title: 'OTR Universe',
    description: 'Community-governed worldbuilding DAO',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-otr-void text-slate-200 antialiased">
        <Nav />
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-otr-border py-8 text-center text-sm text-otr-silver">
          <p className="font-display tracking-widest text-xs text-otr-gold-dim uppercase">OTR Universe</p>
          <p className="mt-1 opacity-50">The world belongs to those who write it.</p>
        </footer>
      </body>
    </html>
  );
}
