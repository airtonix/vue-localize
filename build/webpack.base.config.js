import path from 'path';
import Config from 'webpack-config';


export default new Config()
  .merge({
    entry: "./src",
    output: {
        path: "./dist",
        filename: "vue-localize.js",
        library: "VueLocalize",
        libraryTarget: "umd"
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel',
          exclude: /node_modules/,
        },
        {
          test: /\.json$/,
          loader: 'json'
        },
      ]
    },
    resolveLoader: {
      fallback: [path.join(__dirname, '../node_modules')]
    },
    resolve: {
      extensions: ['', '.js'],
      fallback: [path.join(__dirname, '../node_modules')],
      alias: {
        'src': path.resolve(__dirname, '../src')
      }
    }
  });
