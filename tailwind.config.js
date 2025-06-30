/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'green-25': '#f0fdf4',
        'blue-25': '#f0f9ff',
        'green-100': '#dcfce7',
        'blue-100': '#dbeafe',
        'emerald-100': '#d1fae5',
        'indigo-100': '#e0e7ff',
      }
    },
  },
  plugins: [],
};
