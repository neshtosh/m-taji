/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFD700', // Gold
          light: '#FFE55C',
          dark: '#D4AF37',
        },
        secondary: {
          DEFAULT: '#10B981', // Green
          light: '#34D399',
          dark: '#059669',
        },
        accent: {
          DEFAULT: '#000000', // Black
          light: '#1F2937',
          dark: '#111827',
        },
        text: {
          dark: '#000000',
          light: '#FFFFFF',
        }
      },
      fontFamily: {
        'arboria': ['Fredoka', 'sans-serif'],
        'sans': ['Fredoka', 'sans-serif'],
        'artistic': ['Playfair Display', 'serif'],
        'italic': ['Crimson Text', 'serif'],
      },
    },
  },
  plugins: [],
};
