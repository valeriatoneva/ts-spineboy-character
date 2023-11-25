const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development' ,
  entry: './scripts/Main.ts', 
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      // ... any other rules
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'assets', to: 'assets' }, // Copies all files from your local 'assets' folder to 'dist/assets'
      ],
    }),
    new HtmlWebpackPlugin({
      template: './index.html', // Path to your index.html file
    }),
    // ... any other plugins
  ],
  // ... rest of your webpack configuration
};
