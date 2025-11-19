/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Neutral base colors for UI
        neutral: {
          50: '#FCFCFC',    // Background
          100: '#F5F5F5',   // Surface
          200: '#E5E5E5',   // Lines/Borders
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#6E6E6E',   // Text secondary
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#1A1A1A',   // Text primary
          950: '#0A0A0A',
        },
        // Secondary (alias for neutral)
        secondary: {
          50: '#FCFCFC',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#6E6E6E',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#1A1A1A',
          950: '#0A0A0A',
        },
        // Primary (alias for accent)
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#4F46E5',
          600: '#4338CA',
          700: '#3730A3',
          800: '#312E81',
          900: '#1E1B4B',
          950: '#1E1B4B',
        },
        // Accent color (Indigo) - AI + actions
        accent: {
          50: '#EEF2FF',    // Subtle
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#4F46E5',   // Main accent
          600: '#4338CA',   // Hover
          700: '#3730A3',
          800: '#312E81',
          900: '#1E1B4B',
          950: '#1E1B4B',
        },
        // Success feedback
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // Warning feedback
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Error feedback
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        // Info feedback
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // AI Identity (Tako)
        ai: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C4B5FD',   // Shadow
          500: '#A78BFA',
          600: '#7C3AED',   // Glow
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          950: '#2E1065',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
