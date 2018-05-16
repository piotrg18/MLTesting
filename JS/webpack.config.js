const path = require('path')

module.exports = {
  entry: {
    main: './src/'
  },

  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'build')
  },
  resolve: {
    extensions: [".js", ".tsx", ".ts", ".json", ".html"]
  },
  module: {
    rules: [
        { test: /\.ts$/, loader: "awesome-typescript-loader" },
        {
          test: /\.js$/,
          use: ["source-map-loader"],
          enforce: "pre"
        }
    ]
},
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    port: 8000
  },
  devtool: 'source-map',
  mode: 'development'
}