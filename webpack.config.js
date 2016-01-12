const path = require('path');

module.exports = {
  entry: "./index",
  output: {
    path: __dirname + "/dist",
    filename: "beesly.js",
    library: "Beesly",
    libraryTarget: "umd"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        },
        include: [
          path.resolve(__dirname, "src")
        ]
      }
    ]
  }
}
