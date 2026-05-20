import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          white: '#FAF8F5',
          cream: '#F0ECE4',
          sand: '#E5DFD3',
          stone: '#D4CCBD',
          taupe: '#B8AFA0',
        },
        dark: {
          ink: '#1A1A1E',
          charcoal: '#222226',
          graphite: '#2C2C32',
          slate: '#38383F',
          ash: '#48484F',
        },
        oracle: {
          gold: '#C8A44E',
          'gold-light': '#DBBF6F',
          'gold-dark': '#A88A3A',
          'gold-muted': 'rgba(200, 164, 78, 0.12)',
        },
        prob: {
          high: '#2ECC71',
          mid: '#F0AD4E',
          low: '#8A8A94',
        },
        cat: {
          goals: '#C8E64E',
          corners: '#B49AFA',
          cards: '#E5DFD3',
          result: '#5C4A3A',
        },
        value: '#A78BFA',
        live: '#22D3EE',
        danger: '#EF4444',
        txt: {
          primary: '#1A1A1E',
          secondary: '#5A5A64',
          tertiary: '#8A8A94',
          inverse: '#FAF8F5',
          'inverse-2': '#CCCCC4',
        },
      },
      fontFamily: {
        display: 'var(--font-display, "Space Grotesk"), sans-serif',
        body: 'var(--font-body, "Inter"), sans-serif',
        mono: 'var(--font-mono, "JetBrains Mono"), monospace',
      },
      fontSize: {
        'display-xl': ['4rem', { lineHeight: '1.1', fontWeight: '700' }],
        'display-lg': ['3rem', { lineHeight: '1.1', fontWeight: '700' }],
        'display-md': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
        'display-sm': ['1.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        heading: ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],
        subhead: ['1rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
        body: ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['0.8125rem', { lineHeight: '1.5', fontWeight: '400' }],
        caption: ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
        'mono-sm': ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }],
      },
      borderRadius: {
        'oracle-sm': '8px',
        'oracle-md': '14px',
        'oracle-lg': '20px',
        'oracle-xl': '28px',
      },
      boxShadow: {
        soft: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        card: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'card-dark': '0 10px 15px -3px rgb(0 0 0 / 0.2), 0 4px 6px -4px rgb(0 0 0 / 0.2)',
        glow: '0 0 20px 0 rgba(200, 164, 78, 0.4)',
      },
      keyframes: {
        'pulse-live': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'slide-up': {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'pulse-live': 'pulse-live 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slide-up 0.4s ease-out',
        'fade-in': 'fade-in 0.3s ease-in',
      },
      transitionTimingFunction: {
        oracle: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        fast: '120ms',
        normal: '200ms',
        slow: '400ms',
      },
    },
  },
  plugins: [],
};

export default config;
