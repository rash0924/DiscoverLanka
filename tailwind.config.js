/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          50: '#f0faf4',
          100: '#dcf4e6',
          200: '#bce9d0',
          300: '#8dd7b0',
          400: '#57be8a',
          500: '#1B6B3A',
          600: '#166030',
          700: '#145228',
          800: '#124221',
          900: '#0e361b',
        },
        ocean: {
          DEFAULT: 'var(--color-ocean)',
          50: '#eff8ff',
          100: '#dbeffe',
          200: '#bfe3fd',
          300: '#93d1fc',
          400: '#60b6f8',
          500: '#1E6FA8',
          600: '#1a6397',
          700: '#165280',
          800: '#134469',
          900: '#0f3757',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          50: '#fff8ed',
          100: '#feefd3',
          200: '#fcdca5',
          300: '#f9c26e',
          400: '#F7941D',
          500: '#e8820a',
          600: '#cc6e07',
          700: '#a8560a',
          800: '#88440f',
          900: '#6e390f',
        },
        sand: {
          DEFAULT: 'var(--color-sand)',
          50: '#fafaf8',
          100: '#F5F0E8',
          200: '#ebe3d5',
          300: '#ddd0bc',
          400: '#ccb89d',
          500: '#b8a07a',
        },
        charcoal: {
          DEFAULT: 'var(--color-charcoal)',
          800: '#1a2332',
          900: '#0f1923',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        shimmer: 'shimmer 2s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
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
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        shimmer: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)',
        glass: '0 8px 32px rgba(0,0,0,0.12)',
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
