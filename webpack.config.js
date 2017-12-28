module.exports = {
  entry: __dirname + '/src/index.js',
  target: 'electron',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: __dirname + '/'
  },
  devServer: {
    inline: false
  },
  devtool: 'source-map'
}
