/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        /* FilmSort palette */
        'fs-black':       '#000000',
        'fs-deep':        '#0b0b0b',
        'fs-card':        'rgba(255,255,255,0.04)',
        'fs-border':      'rgba(255,255,255,0.07)',
'fs-red':         '#8b5cf6',
        'fs-purple':      '#8b5cf6',
        'fs-green':       '#4ade80',
        'fs-amber':       '#f59e0b',
        'fs-blue':        '#60a5fa',
        'fs-yellow':      '#facc15',
        'fs-pink':        '#f87171',
        'fs-white':       '#ffffff',
        'fs-body':        '#a1a1aa',
        'fs-muted':       '#52525b',
        'fs-desc':        '#d4d4d8',
        'fs-zinc':        '#27272a',
        'fs-zinc-dark':   '#18181b',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontWeight: {
        heavy: '800',
        black: '900',
      },
      letterSpacing: {
        'tight-xl': '-0.04em',
        'tight-lg': '-0.03em',
        'tight-md': '-0.02em',
      },
      borderRadius: {
        'fs-sm': '8px',
        'fs-md': '14px',
        'fs-lg': '18px',
        'fs-xl': '20px',
        'pill':  '9999px',
      },
      boxShadow: {
        'red-glow':   '0 0 32px rgba(139,92,246,0.28)',
        'green-glow': '0 0 24px rgba(74,222,128,0.18)',
        'card':       '0 16px 48px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'cinema': 'linear-gradient(to top, #000000 0%, #000000 25%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0.1) 100%)',
        'dark-fade': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        redGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(139,92,246,0)' },
          '50%':      { boxShadow: '0 0 28px 4px rgba(139,92,246,0.22)' },
        },
      },
      animation: {
        'fade-up':  'fadeUp 400ms cubic-bezier(0.16,1,0.3,1) both',
        'fade-in':  'fadeIn 400ms ease both',
        'red-glow': 'redGlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
