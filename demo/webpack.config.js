const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/, 
        use: 'babel-loader',
        include: [
          path.resolve(__dirname, 'src')
        ] 
      },
      {
        test: /^(?!global).*\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { modules: true } },
          { loader: 'sass-loader'}
        ]
      },
      {
        test: /^global\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { modules: false } },
          { loader: 'sass-loader'}
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
        use: [
          { loader: 'url-loader' }
        ]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, 'index.html')
    })
  ]
};