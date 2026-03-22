import type { Metadata } from 'next';
import { Inter, Cinzel } from 'next/font/google';
import './globals.css';
import { Nav } from '@/components/layout/Nav';
import Link from 'next/link';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '600', '700'],
  display: 'swap',
});

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
    <html lang="ko" className={`${inter.variable} ${cinzel.variable}`}>
      <body className="antialiased">
        <Nav />
        <main className="min-h-screen">{children}</main>

        <footer className="border-t border-[#1e1e3a] mt-20">
          <div className="max-w-6xl mx-auto px-4 py-14">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0"
                    style={{ background: 'linear-gradient(135deg, #f0c07a, #c8953a)', color: '#08080f' }}>
                    ◈
                  </div>
                  <span className="font-display font-semibold tracking-wider text-sm"
                    style={{ color: '#f0c07a' }}>OTR Universe</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#4a5568' }}>
                  The world belongs to<br />those who write it.
                </p>
              </div>

              {[
                {
                  heading: 'Explore',
                  links: [['Universes', '/universes'], ['Lore', '/lore'], ['Proposals', '/proposals']],
                },
                {
                  heading: 'Community',
                  links: [['Battles', '/battles'], ['Videos', '/videos'], ['Submit LIP', '/proposals/new']],
                },
                {
                  heading: 'System',
                  links: [['Phase 1 (Active)', '#'], ['Phase 2 — Token', '#'], ['Phase 3 — DAO', '#']],
                },
              ].map(({ heading, links }) => (
                <div key={heading}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-4 text-otr-dim">{heading}</p>
                  <ul className="space-y-2.5">
                    {links.map(([label, href]) => (
                      <li key={href}>
                        <Link href={href} className="text-xs text-[#4a5568] hover:text-otr-text transition-colors">
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-[#1a1a30] flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-xs" style={{ color: '#374151' }}>© 2026 OTR Universe. All rights reserved.</p>
              <p className="text-xs font-mono tracking-widest" style={{ color: '#374151' }}>LORE · GOVERN · CREATE</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
