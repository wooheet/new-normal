import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        otr: {
          void:    '#070712',
          dark:    '#0a0a1a',
          surface: '#0d0d1e',
          card:    '#0f0f22',
          border:  '#1e1e3a',
          line:    '#252548',
          muted:   '#2d2d52',
          text:    '#8892a4',
          dim:     '#4a5568',
          gold:    '#f0c07a',
          'gold-2':'#c8953a',
          silver:  '#c8d5e8',
          cyan:    '#22d3ee',
          violet:  '#8b5cf6',
          green:   '#22c55e',
          red:     '#f87171',
        },
      },
      fontFamily: {
        sans:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-cinzel)', 'serif'],
        mono:    ['var(--font-inter)', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'gold-shine': 'linear-gradient(135deg, #f0c07a, #c8953a)',
        'void-glow':  'radial-gradient(ellipse 100% 55% at 50% 0%, rgba(109,77,200,0.11) 0%, transparent 65%)',
        'gold-glow':  'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(240,192,122,0.12) 0%, transparent 70%)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 100%)',
      },
      boxShadow: {
        'glow-gold':   '0 0 0 1px rgba(240,192,122,0.25), 0 4px 20px rgba(240,192,122,0.1)',
        'glow-violet': '0 0 0 1px rgba(139,92,246,0.35), 0 4px 20px rgba(139,92,246,0.12)',
        'glow-green':  '0 0 0 1px rgba(34,197,94,0.3),   0 4px 20px rgba(34,197,94,0.08)',
        'card':        '0 1px 0 0 rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.5)',
        'float':       '0 12px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
        'inner-gold':  'inset 0 1px 0 0 rgba(240,192,122,0.12)',
      },
      animation: {
        'fade-up':    'fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in':    'fadeIn 0.35s ease both',
        'spin-slow':  'spin 8s linear infinite',
        'pulse-slow': 'pulse 3s ease infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};

export default config;
