const HtmlPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'development',
  output: {
    path: `${__dirname}/demo`
  },
  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' }]
  },
  plugins: [new HtmlPlugin({ template: 'src/index.html' }), new CopyPlugin({ patterns: [{ from: 'src/static' }] })],
  resolve: {
    // Allow absolute imports from these two directories
    modules: ['src', 'node_modules']
  },
  devServer: {
    // Less output in the terminal, and a bit faster build too!
    stats: 'errors-only'
  },
  devtool: 'eval-source-map'
}
