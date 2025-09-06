const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const { HotModuleReplacementPlugin } = require("webpack")
const path = require('path');

const entries = {
  'main': ['./src/client/pages/main/index.ts'],
  'chatRoom': ['./src/client/pages/chatRoom/index.ts']
}

module.exports = {
  entry: entries,
  mode: process.env.NODE_ENV,

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "[name].[fullhash].js",
    clean: true,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader'
          }
        ],
      },
      {
        test: /\.gif/,
        type: 'asset/resource'
      },
      { 
        test: /\.tsx?$/, 
        loader: "ts-loader", 
        options: {
          configFile: 'tsconfigClient.json'
        } 
      }
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',   
      chunks: ['main'],
      template: './src/client/pages/main/index.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'chatRoom/chatRoom.html',  // dist/chatRoom/chatRoom.html → http://127.0.0.1:3000/chatRoom/chatRoom.html
      chunks: ['chatRoom'],
      template: './src/client/pages/chatRoom/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name]/index.[fullhash].css'
    }),
    new CompressionPlugin(),
    new HotModuleReplacementPlugin(),
  ],
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
}