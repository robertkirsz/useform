const HtmlPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: `${__dirname}/src/index.js`,
  output: { path: `${__dirname}/demo` },
  module: { rules: [{ test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' }] },
  plugins: [new HtmlPlugin({ template: 'src/index.html' }), new CopyPlugin({ patterns: [{ from: 'src/static' }] })],
  resolve: { modules: ['src', 'node_modules'] },
  devServer: { stats: 'errors-only' },
  devtool: 'eval-source-map'
}
