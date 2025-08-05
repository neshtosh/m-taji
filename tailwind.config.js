/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D4A017', // Mustard/Golden with darker hue
          light: '#E6B800',
          dark: '#B8860B',
        },
        secondary: {
          DEFAULT: '#0D9488', // Teal
          light: '#14B8A6',
          dark: '#0F766E',
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
              'bold-rounded': ['Chelsea Market', 'cursive'],
            },
    },
  },
  plugins: [],
};
