import path from 'path';
import webpack from 'webpack';
import Config from 'webpack-config';

import PKG from "../package.json";

const banner =
    "/**\n" +
    " * vue-localize v" + PKG.version + "\n" +
    " * https://github.com/Saymon-biz/vue-localize\n" +
    " * Released under the MIT License.\n" +
    " */\n";

export default new Config()
  .extend({
    './build/webpack.base.config.js': config => {
        delete config.debug;
        delete config.devtool;
        delete config.output.pathinfo;
        return config;
      }
  })
  .merge({
    filename: __filename,
    plugins: [
        new webpack.BannerPlugin(banner, {raw: true}),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(true),
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            output: {
                comments: false
            },
            compress: {
                warnings: false
            }
        })
    ],
  });
