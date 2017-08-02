/* globals __dirname, process */

const path = require('path');
const rootPath = path.normalize(__dirname + '/..');

// eslint-disable-next-line no-process-env
const env = process.env.NODE_ENV || 'dev';
// eslint-disable-next-line no-process-env
const envPort = process.env.PORT;
// eslint-disable-next-line no-process-env
const envConnString = process.env.MONGO;
// eslint-disable-next-line no-process-env
const envDbSecret = process.env.SECRET;

const config = {
	dev: {
		root: rootPath,
		app: {
			name: 'leisure-project',
		},
		port: envPort || 3000,
		connectionString: envConnString || 'mongodb://localhost:27017/leisureDb',
		secretString: envDbSecret || 'Secret magical popcorn',
	},
	production: {
		root: rootPath,
		app: {
			name: 'leisure-project',
		},
		port: envPort,
		connectionString: envConnString,
		secretString: envDbSecret,
	},
};

module.exports = config[env];
