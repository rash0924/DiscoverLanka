/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          50: '#eff8f1',
          100: '#def0e2',
          200: '#c0e3ca',
          300: '#94d0a7',
          400: '#60b47d',
          500: '#338e59',
          600: '#267448',
          700: '#205d3b',
          800: '#1b4b32',
          900: '#163d2a',
        },
        ocean: {
          DEFAULT: 'var(--color-ocean)',
          50: '#eff8fc',
          100: '#d9edf6',
          200: '#b9deed',
          300: '#88c8e0',
          400: '#53acd0',
          500: '#2d8db7',
          600: '#23739a',
          700: '#205d7d',
          800: '#204e67',
          900: '#1e4257',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          50: '#fff9e9',
          100: '#f9edc8',
          200: '#f1dc99',
          300: '#e6c36b',
          400: '#d6a941',
          500: '#c38d2e',
          600: '#a96e24',
          700: '#875020',
          800: '#704121',
          900: '#60371f',
        },
        sand: {
          DEFAULT: 'var(--color-sand)',
          50: '#fbfaf4',
          100: '#f4f1e5',
          200: '#e9e4d2',
          300: '#d9d1b8',
          400: '#c5b99a',
          500: '#ab9d7c',
        },
        charcoal: {
          DEFAULT: 'var(--color-charcoal)',
          800: '#1b3a2c',
          900: '#142b21',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.28s cubic-bezier(0.2, 0.75, 0.25, 1)',
        'scale-in': 'scaleIn 0.2s ease-out',
        shimmer: 'shimmer 2s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        float: 'float 7s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0.7', transform: 'translateX(-18px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -12px, 0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        shimmer: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      },
      boxShadow: {
        card: '0 8px 26px rgba(34, 88, 57, 0.09), 0 2px 7px rgba(34, 64, 45, 0.04)',
        'card-hover': '0 20px 44px rgba(34, 88, 57, 0.16), 0 5px 14px rgba(34, 64, 45, 0.08)',
        glass: '0 12px 42px rgba(26, 67, 44, 0.18)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
