const designSystemConfig = require('@taskly/design-system/tailwind.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [designSystemConfig],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/design-system/src/**/*.{js,ts,jsx,tsx}',
  ],
};
