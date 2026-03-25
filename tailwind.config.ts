import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        kotlin: {
          DEFAULT: '#7F52FF',
          light:   '#9B72FF',
          dark:    '#5E3BCC',
          glow:    'rgba(127,82,255,0.3)',
        },
        surface: {
          DEFAULT: '#0D0D0D',
          2: '#1A1A1A',
          3: '#262626',
          4: '#333333',
        },
        success: '#4CAF50',
        error:   '#F44336',
        warning: '#FF9800',
        hint:    '#FFC107',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'shake': 'shake 0.3s ease-in-out',
        'pulse-green': 'pulseGreen 0.4s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
        pulseGreen: {
          '0%': { boxShadow: '0 0 0 0 rgba(76,175,80,0.6)' },
          '100%': { boxShadow: '0 0 0 12px rgba(76,175,80,0)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(-4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
} satisfies Config
