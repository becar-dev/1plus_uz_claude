import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        cyan: {
          50: '#E0F7FA',
          100: '#B2EBF2',
          200: '#80DEEA',
          300: '#4DD0E1',
          400: '#26C6DA',
          500: '#00BCD4',
          600: '#00ACC1',
          700: '#0097A7',
          800: '#00838F',
          900: '#006064',
        },
        magenta: {
          50: '#FCE4EC',
          100: '#F8BBD0',
          200: '#F48FB1',
          300: '#F06292',
          400: '#EC407A',
          500: '#E91E63',
          600: '#D81B60',
          700: '#C2185B',
          800: '#AD1457',
          900: '#880E4F',
        },
        yellow: {
          50: '#FFF8E1',
          100: '#FFECB3',
          200: '#FFE082',
          300: '#FFD54F',
          400: '#FFCA28',
          500: '#FFC107',
          600: '#FFB300',
          700: '#FFA000',
          800: '#FF8F00',
          900: '#FF6F00',
        },
        neutral: {
          50: '#FAFAF8',
          100: '#F5F5F0',
          200: '#EDEDEA',
          300: '#D4D4CF',
          400: '#A3A39E',
          500: '#737370',
          600: '#5C5C59',
          700: '#434340',
          800: '#2D2D2B',
          900: '#1A1A18',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        '7xl': ['4.5rem', { lineHeight: '1.1' }],
        '8xl': ['6rem', { lineHeight: '1.05' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      screens: {
        mobile: '480px',
        tablet: '768px',
        laptop: '1024px',
        desktop: '1440px',
      },
      backgroundImage: {
        'gradient-cmyk': 'linear-gradient(135deg, #00BCD4, #E91E63, #FFC107)',
        'gradient-cmyk-light': 'linear-gradient(135deg, #4DD0E1, #F06292, #FFD54F)',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(26, 26, 24, 0.04)',
        'md': '0 4px 12px rgba(26, 26, 24, 0.06)',
        'lg': '0 12px 32px rgba(26, 26, 24, 0.08)',
        'xl': '0 24px 64px rgba(26, 26, 24, 0.12)',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'scale-in': 'scaleIn 0.25s ease forwards',
        'blur-in': 'blurIn 0.4s ease forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        blurIn: {
          from: { opacity: '0', filter: 'blur(8px)' },
          to: { opacity: '1', filter: 'blur(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
