import type { WithNxOptions } from '@nx/next/plugins/with-nx';
import { i18nNamespaces } from './i18n/config';

const { composePlugins, withNx } = require('@nx/next');
const path = require('path');
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: i18nNamespaces.map(
      (ns) => `./messages/en/${ns}.json`
    ),
  },
});

const nextConfig: WithNxOptions = {
  nx: {},
  transpilePackages: ['@taskly/design-system'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@taskly/design-system': path.resolve(
        __dirname,
        '../../packages/design-system/src'
      ),
      '@features': path.resolve(__dirname, 'features'),
    };
    return config;
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withNextIntl,
];

export default composePlugins(...plugins)(nextConfig);
