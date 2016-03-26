var path = require('path');
var webpack = require("webpack");
var version = require("../package.json").version;
var cssLoaders = require('./css-loaders')
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
      library: "VueLocalize",
      libraryTarget: "umd"
  },
  plugins: [
      new webpack.BannerPlugin(banner, {raw: true})
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['es2015'],
          cacheDirectory: true,
          plugins: ["lodash"]
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.html$/,
        loader: 'vue-html'
      },
      {
        test: /\.(png|jpg|gif|svg|woff2?|eot|ttf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: '[name].[ext]?[hash:7]'
        }
      }
    ]
  },
  vue: {
    loaders: cssLoaders()
  },
  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },
  resolve: {
    extensions: ['', '.js', '.vue'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'src': path.resolve(__dirname, '../src')
    }
  }
};
