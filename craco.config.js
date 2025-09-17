const path = require('path');
const { getLoader, loaderByName } = require('@craco/craco');

const packages = [];
packages.push(path.join(__dirname, '../packages/core'));

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@core': path.resolve(__dirname, '../packages/core'),
      '@entities': path.resolve(__dirname, 'packages/core/models'),
    }
  },
};

configure: (webpackConfig, { env, paths }) => {
    const { isFound, match } = getLoader(
      webpackConfig, 
      loaderByName('babel-loader')
    );
    if (isFound) {
      const include = Array.isArray(match.loader.include)
        ? match.loader.include
        : [match.loader.include];

      match.loader.include = include.concat([
        path.resolve(__dirname, 'packages')
      ]);
    }
    return webpackConfig;
   }