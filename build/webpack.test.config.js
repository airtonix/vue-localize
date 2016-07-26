import path from 'path';
import webpack from 'webpack';
import Config from 'webpack-config';
import cssLoaders from './css-loaders';


export default new Config()
  .extend({
    './build/webpack.base.config.js': config => {
        delete config.entry;
        return config;
      }
  })
  .merge({
    filename: __filename,
    debug: true,
    devtool: '#source-map',
    output: {
        pathinfo: true
    },
    module: {
      loaders: [
        {
          test: /\.vue$/,
          loader: 'vue'
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
      loaders: Object.assign(cssLoaders(), {
        js: 'isparta'
      })
    },
    resolve: {
      extensions: ['', '.js', '.vue'],
    }
  });
  vue: {
  }