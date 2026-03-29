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
        primary: {
          50: '#f0f9f6',
          100: '#d4f0e7',
          200: '#a8e1cf',
          300: '#6ecaaf',
          400: '#3db08f',
          500: '#1a936f',
          600: '#147a5c',
          700: '#10614a',
          800: '#0d4d3b',
          900: '#0a3e30',
        },
        accent: {
          50: '#fdf4f8',
          100: '#fce8f1',
          200: '#fbd0e3',
          300: '#f9a8cb',
          400: '#f472a8',
          500: '#eb4486',
          600: '#d92667',
          700: '#bc184f',
          800: '#9b1742',
          900: '#81183b',
        },
        dark: '#1a1a2e',
        light: '#fafbfc',
        gray: {
          900: '#111111',
          800: '#222222',
          700: '#444444',
          600: '#666666',
          500: '#888888',
        },
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
