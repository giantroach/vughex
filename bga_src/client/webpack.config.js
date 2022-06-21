const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    main: './bga_src/client/vughex.ts',
  },
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: 'vughex.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.scss$/,
        loader: 'sass-loader',
      },
    ],
  },
};
