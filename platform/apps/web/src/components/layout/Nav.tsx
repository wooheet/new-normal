'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { BookOpen, ScrollText, User, Sword, Film } from 'lucide-react';

const links = [
  { href: '/lore', label: 'Lore', icon: BookOpen },
  { href: '/proposals', label: 'Proposals', icon: ScrollText },
  { href: '/battles', label: 'Battles', icon: Sword },
  { href: '/videos', label: 'Videos', icon: Film },
  { href: '/profile', label: 'Profile', icon: User },
];

export function Nav() {
  const path = usePathname();

  return (
    <nav className="sticky top-0 z-50 glass border-b border-otr-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center text-otr-void font-bold text-sm">
            ◈
          </span>
          <span className="font-display font-semibold tracking-wider text-otr-gold group-hover:text-otr-gold/80 transition-colors">
            OTR Universe
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                path.startsWith(href)
                  ? 'bg-otr-muted text-otr-gold'
                  : 'text-otr-silver hover:text-slate-200 hover:bg-otr-border'
              )}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
