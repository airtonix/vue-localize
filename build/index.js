import webpack from 'webpack';
import config from './webpack.config';

webpack(config)
	.run( (err, done) => {
		if (err) { console.error(err); }
	});