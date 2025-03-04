const { join } = require('path')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, '../libs/ui/src/**/*.{js,ts,jsx,tsx}'),
    join(__dirname, '../**/*.stories.{js,ts,jsx,tsx}'),
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E53935',
          dark: '#C62828',
        },
        secondary: {
          DEFAULT: '#1E88E5',
          dark: '#1565C0',
        },
      },
    },
  },
  plugins: [],
}
