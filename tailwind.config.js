/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        'tech-dark': '#0a0a0f',
        'tech-darker': '#12121a',
        'tech-cyan': '#00d4ff',
        'tech-purple': '#7c3aed',
        'tech-text': '#e4e4e7',
      },
      fontFamily: {
        'heading': ['Orbitron', 'sans-serif'],
        'body': ['Noto Sans TC', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
