const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const root = path.resolve(__dirname, '..');
const src = path.resolve(root, 'src');

module.exports = {
  mode: 'production',
  entry: {
    'hooks/useForm': `${src}/hooks/useForm`,
  },
  output: {
    path: path.resolve(root, './dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [`${src}/hooks`],
        use: 'babel-loader',
      },
    ],
  },
  externals: {
    react: 'commonjs2 react',
    'react-dom': 'commonjs2 react-dom',
    'prop-types': 'commonjs2 prop-types',
    'styled-components': 'commonjs2 styled-components',
  },
  resolve: {
    modules: ['node_modules', root],
  },
};
