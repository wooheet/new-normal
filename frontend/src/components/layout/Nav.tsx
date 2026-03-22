'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { BookOpen, ScrollText, User, Sword, Film, Globe, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { AuthModal } from '@/features/auth/components/AuthModal';

const links = [
  { href: '/universes', label: 'Universes', icon: Globe },
  { href: '/lore',      label: 'Lore',      icon: BookOpen },
  { href: '/proposals', label: 'Proposals', icon: ScrollText },
  { href: '/battles',   label: 'Battles',   icon: Sword },
  { href: '/videos',    label: 'Videos',    icon: Film },
];

export function Nav() {
  const path = usePathname();
  const router = useRouter();
  const { user, loading, login, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  function handleAuthSuccess(token: string, u: any) {
    login(token, u);
    setShowAuth(false);
  }

  return (
    <>
      <nav
        className="sticky top-0 z-50"
        style={{
          background: 'rgba(7,7,18,0.8)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(30,30,58,0.8)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 h-[60px] flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-transform group-hover:scale-95"
              style={{ background: 'linear-gradient(135deg, #f0c07a, #c8953a)', color: '#07070e' }}
            >
              ◈
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-display font-semibold tracking-wider text-sm leading-tight"
                style={{ color: '#f0c07a' }}>OTR</span>
              <span className="text-[9px] tracking-[0.2em] uppercase"
                style={{ color: '#4a5568' }}>Universe</span>
            </div>
          </Link>

          {/* Center nav — desktop */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center p-1 rounded-xl"
              style={{ background: 'rgba(15,15,34,0.6)', border: '1px solid rgba(30,30,58,0.7)' }}>
              {links.map(({ href, label }) => {
                const isActive = path.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={clsx(
                      'relative px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'text-slate-100'
                        : 'text-[#4a5568] hover:text-slate-300'
                    )}
                    style={isActive ? {
                      background: 'rgba(240,192,122,0.1)',
                      boxShadow: 'inset 0 1px 0 rgba(240,192,122,0.15)',
                      color: '#f0c07a',
                    } : {}}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: auth + mobile menu */}
          <div className="flex items-center gap-2 shrink-0">
            {!loading && (
              user ? (
                <>
                  <Link
                    href="/profile"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all"
                    style={{ color: '#8892a4', border: '1px solid transparent' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#e2e8f0';
                      e.currentTarget.style.borderColor = '#1e1e3a';
                      e.currentTarget.style.background = 'rgba(15,15,34,0.8)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = '#8892a4';
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <User size={14} />
                    <span className="max-w-[100px] truncate">{user.username}</span>
                  </Link>
                  <button
                    onClick={() => { logout(); router.push('/'); }}
                    className="p-2 rounded-lg transition-all"
                    style={{ color: '#4a5568' }}
                    title="로그아웃"
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.color = '#f87171';
                      (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.08)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.color = '#4a5568';
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                  >
                    <LogOut size={15} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all hover:opacity-88"
                  style={{
                    background: 'linear-gradient(135deg, #f0c07a, #c8953a)',
                    color: '#09090e',
                    boxShadow: '0 2px 10px rgba(240,192,122,0.2)',
                  }}
                >
                  로그인
                </button>
              )
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg transition-all"
              style={{ color: '#4a5568' }}
              onClick={() => setMenuOpen(v => !v)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4 pt-1 space-y-1"
            style={{ borderTop: '1px solid rgba(30,30,58,0.6)' }}>
            {links.map(({ href, label, icon: Icon }) => {
              const isActive = path.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={isActive
                    ? { color: '#f0c07a', background: 'rgba(240,192,122,0.08)' }
                    : { color: '#4a5568' }}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />}
    </>
  );
}
