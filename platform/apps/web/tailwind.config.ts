import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // OTR Universe brand colors — dark fantasy aesthetic
        otr: {
          void: '#050508',
          dark: '#0d0d14',
          surface: '#13131f',
          border: '#1e1e2e',
          muted: '#2a2a3e',
          gold: '#c8a96e',
          'gold-dim': '#8a7048',
          silver: '#a0a8c0',
          cyan: '#4de8d4',
          purple: '#8b5cf6',
          red: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-cinzel)', 'serif'],
      },
      backgroundImage: {
        'void-gradient': 'radial-gradient(ellipse at top, #1a1a2e 0%, #050508 60%)',
        'gold-gradient': 'linear-gradient(135deg, #c8a96e 0%, #8a7048 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
