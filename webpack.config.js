//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

'use strict';

const path = require('path');

// eslint-disable-next-line @typescript-eslint/naming-convention
const CopyPlugin = require('copy-webpack-plugin');

/** @type WebpackConfig */
const config = {
  target: 'node',
  entry: {
    extension: './src/extension.ts',
    server: './src/server.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]',
  },
  externals: {
    vscode: 'commonjs vscode', // the vscode-module is created on-the-fly and must be excluded
    prettier: 'commonjs prettier',
  },
  resolve: {
    // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
    extensions: ['.ts', '.js']
  },
  plugins: [
    new CopyPlugin({
      patterns: [{
        from: 'node_modules/@shopify/liquid-language-server-node/dist/theme-liquid-docs/*.json',
        to: 'theme-liquid-docs/[name][ext]',
      }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  },
  devtool: 'source-map',
  infrastructureLogging: {
    level: "log", // enables logging required for problem matchers
  },
};
module.exports = [ config ];
