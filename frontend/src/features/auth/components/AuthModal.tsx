'use client';

import { useState } from 'react';
import { X, LogIn, UserPlus, Sparkles } from 'lucide-react';
import { fetcher } from '@/lib/api';

interface Props {
  onClose: () => void;
  onSuccess: (token: string, user: any) => void;
}

export function AuthModal({ onClose, onSuccess }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res: any = mode === 'login'
        ? await fetcher('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: form.email, password: form.password }) })
        : await fetcher('/api/auth/register', { method: 'POST', body: JSON.stringify(form) });
      onSuccess(res.data?.token ?? res.token, res.data?.user ?? res.user);
    } catch (err: any) {
      setError(err.message || '인증 실패');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(7,7,18,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[420px] mx-4 rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(#0c0c20, #0c0c20) padding-box, linear-gradient(135deg, rgba(139,92,246,0.4), rgba(30,30,58,0.8), rgba(240,192,122,0.2)) border-box',
          border: '1px solid transparent',
          boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top gradient line */}
        <div className="h-px w-full"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.6) 30%, rgba(240,192,122,0.5) 70%, transparent 100%)' }} />

        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-28 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top, rgba(109,77,200,0.2) 0%, transparent 70%)' }} />

        <div className="relative p-8">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{ color: '#374155', border: '1px solid transparent' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = '#e2e8f0';
              (e.currentTarget as HTMLElement).style.background = 'rgba(30,30,58,0.8)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(30,30,58,0.8)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = '#374155';
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
            }}
          >
            <X size={15} />
          </button>

          {/* Header */}
          <div className="mb-7">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0"
                style={{ background: 'linear-gradient(135deg, #f0c07a, #c8953a)', color: '#09090e' }}>
                ◈
              </div>
              <span className="font-display font-semibold tracking-wider text-sm" style={{ color: '#f0c07a' }}>
                OTR Universe
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold mb-1.5 text-gradient">
              {mode === 'login' ? 'Welcome Back' : 'Join OTR Universe'}
            </h2>
            <p className="text-sm" style={{ color: '#374155' }}>
              {mode === 'login' ? '로그인하고 DAO에 참여하세요.' : '계정을 만들고 세계관을 함께 써내려가세요.'}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex p-1 rounded-xl mb-7"
            style={{ background: 'rgba(10,10,20,0.6)', border: '1px solid rgba(30,30,58,0.7)' }}>
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={mode === m ? {
                  background: 'linear-gradient(#0f0f24, #0f0f24) padding-box, linear-gradient(145deg, #252548, #1a1a3a) border-box',
                  border: '1px solid transparent',
                  color: '#f0c07a',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                } : {
                  color: '#374155',
                  border: '1px solid transparent',
                  background: 'transparent',
                }}
              >
                {m === 'login' ? '로그인' : '회원가입'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <input
                required
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="사용자명 (영문+숫자)"
                minLength={3}
                className="input"
              />
            )}
            <input
              required
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="이메일"
              className="input"
            />
            <input
              required
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="비밀번호"
              minLength={6}
              className="input"
            />

            {error && (
              <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-xl text-sm"
                style={{ background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}>
                <span className="mt-0.5 shrink-0">⚠</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5 mt-1"
            >
              {mode === 'login' ? <LogIn size={15} /> : <UserPlus size={15} />}
              {loading ? '처리 중...' : mode === 'login' ? '로그인' : '가입하기'}
            </button>
          </form>

          <p className="text-center text-xs mt-5 leading-relaxed" style={{ color: '#2a2a48' }}>
            <Sparkles size={10} className="inline mr-1" style={{ color: '#6d4cbc' }} />
            OTR Universe에 참여하면 세계관 DAO 거버넌스에 참여할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
