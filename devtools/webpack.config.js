const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  module: {
    rules: [
      {
        test: /\.js$/, 
        use: 'babel-loader',
        include: [
          path.resolve(__dirname, 'src')
        ] 
      }
    ]
  },
  output: {
    library: 'StreamuxDevTools',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};