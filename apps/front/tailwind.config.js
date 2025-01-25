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
    extend: {},
  },
  plugins: [],
}

export default config
