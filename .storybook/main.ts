import { fileURLToPath } from 'node:url'
import path from 'path'
import type { StorybookConfig } from '@storybook/react-vite'
import react from '@vitejs/plugin-react'
import { mergeConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: [
    path.join(dirname, '../**/*.mdx'),
    path.join(dirname, '../**/*.stories.@(js|jsx|mjs|ts|tsx)'),
  ],
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: {
        docs: false,
      },
    },
    '@storybook/addon-docs',
    '@storybook/blocks',
    '@chromatic-com/storybook',
    '@storybook/experimental-addon-test',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@taskly/shared': path.resolve(dirname, '../libs/shared/src/index.ts'),
          '@taskly/ui': path.resolve(dirname, '../libs/ui/src/index.ts'),
          // Mock Prisma client for Storybook
          '@prisma/client': path.resolve(dirname, './mocks/prisma-client.js'),
        },
      },
      plugins: [
        react(),
        svgr({
          svgrOptions: {
            icon: true,
          },
          include: '**/*.svg',
        }),
      ],
      css: {
        postcss: path.resolve(dirname, './postcss.config.cjs'),
      },
      assetsInclude: ['**/*.svg'],
    })
  },
}

export default config
