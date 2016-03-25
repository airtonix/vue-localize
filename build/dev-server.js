/**
 * Created by vestnik on 25/03/16.
 */
var webpack = require('webpack')
var config = require('./webpack.config')
var compiler = webpack(config)
compiler.watch({
  aggregateTimeout: 300, // wait so long for more changes
  poll: true // use polling instead of native watchers
}, function(err, stats) {
  if (err) {
    console.error(err);
  }
  console.log('rebuild...')
});