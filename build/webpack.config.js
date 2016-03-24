var path = require('path');
var webpack = require("webpack");
var version = require("../package.json").version;
var banner =
    "/**\n" +
    " * vue-localize v" + version + "\n" +
    " * https://github.com/Saymon-biz/vue-localize\n" +
    " * Released under the MIT License.\n" +
    " */\n";

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: "./src/vue-localize",
  output: {
      path: "./dist",
      filename: "vue-localize.js",
      library: "VueLocalize",
      libraryTarget: "umd"
  },
  plugins: [
      new webpack.BannerPlugin(banner, {raw: true}),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015'],
          cacheDirectory: true,
          plugins: ["lodash"]
        }
      }
    ],
    resolve: {
      extensions: ['', '.js']
    }
  }
};
