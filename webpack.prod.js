module.exports = {
  mode: 'production',
  entry: `${__dirname}/src/useForm`,
  output: { path: `${__dirname}/dist`, filename: 'useForm.js', libraryTarget: 'commonjs2' },
  module: { rules: [{ test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' }] },
  externals: { react: 'commonjs2 react' },
  resolve: { modules: ['src', 'node_modules'] },
  devtool: 'source-map'
}
