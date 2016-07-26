/**
 * Created by vestnik on 25/03/16.
 */
import webpack from 'webpack';
import config from './webpack.config';

var watch = {
	aggregateTimeout: 300, // wait so long for more changes
	poll: true // use polling instead of native watchers
};

function done  (err, stats) {
	if (err) {
		console.error(err);
	}
	console.log('rebuild...')
}

webpack(config)
	.watch(watch, done);