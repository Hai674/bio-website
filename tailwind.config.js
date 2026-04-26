/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#020617',
        neon: '#6366f1',
      },
      boxShadow: {
        glow: '0 0 30px rgba(99,102,241,0.35)',
      },
    },
  },
  plugins: [],
};
