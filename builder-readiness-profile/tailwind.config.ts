import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#12161c',
        paper: '#fafaf9',
        accent: '#1f4d3f',
        'accent-light': '#2e6b56',
        border: '#e4e2dd',
        concept: '#5b3ea8',
        'concept-light': '#7a5cc9',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Inter', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
