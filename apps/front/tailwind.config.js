import { fileURLToPath } from 'node:url'
import { dirname, join } from 'path'
import { createGlobPatternsForDependencies } from '@nx/react/tailwind'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
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

export default config
