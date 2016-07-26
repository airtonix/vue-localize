import path from 'path';
import webpack from 'webpack';
import Config from 'webpack-config';
import cssLoaders from './css-loaders';


export default new Config()
  .extend({
    './build/webpack.dev.config.js': config => {
        delete config.entry;
        return config;
      }
  })
  .merge({
    filename: __filename,
  });
