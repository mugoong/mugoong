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
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
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
