import {
    Config,
    ConfigEnvironment
} from 'webpack-config';

ConfigEnvironment.INSTANCE.setAll({
    env: () => process.env.WEBPACK_ENV || process.env.NODE_ENV
});

export default new Config().extend('build/webpack.[env].config.js');
