// This is a karma config file. For more details see
//   http://karma-runner.github.io/0.13/config/configuration-file.html
// we are also using it with karma-webpack
//   https://github.com/webpack/karma-webpack
require('babel-register');

var path = require('path'),
	webpackconfig = require( path.resolve(process.cwd(), 'build/webpack.config'));


module.exports = function (config) {
	config.set({
		browsers: ['PhantomJS'],
		frameworks: ['jasmine'],
		reporters: ['spec', 'coverage'],
		files: ['./index.js'],
		preprocessors: {
			'./index.js': ['webpack', 'coverage']
		},
		webpack: webpackconfig,
		webpackMiddleware: {
			noInfo: true
		},
		coverageReporter: {
			dir: './coverage',
			reporters: [
				{ type: 'lcov', subdir: '.' },
				{ type: 'text-summary' }
			]
		}
	})
}