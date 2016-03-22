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
  entry: "./src/vue-localize",
  output: {
      path: "./dist",
      filename: "vue-localize.js",
      library: "VueLocalize"
  },
  plugins: [
      new webpack.BannerPlugin(banner, {raw: true})
  ],
  module: {
    resolveLoader: {
      root: path.join(__dirname, 'node_modules')
    },
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      }
    ],
    resolve: {
      extensions: ['', '.js']
    }
  }
};
