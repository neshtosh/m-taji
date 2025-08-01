/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00B8A9', // Teal Green
          light: '#00D4C3',
          dark: '#009A8C',
        },
        secondary: {
          DEFAULT: '#DB5A42', // Reddish Orange
          light: '#E67E5A',
          dark: '#C44A35',
        },
        accent: {
          DEFAULT: '#F1C40F', // Mustard Yellow
          light: '#F4D03F',
          dark: '#D4AC0D',
        },
        text: {
          dark: '#1a1a1a',
          light: '#ffffff',
        }
      },
      fontFamily: {
        'arboria': ['Fredoka', 'sans-serif'],
        'sans': ['Fredoka', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
