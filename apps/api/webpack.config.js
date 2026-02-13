const { composePlugins, withNx } = require('@nx/webpack');
const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
const env = dotenv.config({ path: path.join(__dirname, '.env') }).parsed || {};

module.exports = composePlugins(withNx(), (config) => {
  // Add DefinePlugin to inject environment variables
  config.plugins = config.plugins || [];
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(env),
    })
  );

  // Exclude native dependencies from webpack bundling
  config.externals = config.externals || [];
  config.externals.push(
    'bcrypt',
    '@prisma/client',
    'class-validator',
    'class-transformer',
    'express-session'
  );

  return config;
});
