/* globals __dirname, process */

const path = require('path');
const rootPath = path.normalize(__dirname + '/..');

// eslint-disable-next-line no-process-env
const env = process.env.NODE_ENV || 'dev';
// eslint-disable-next-line no-process-env
const envPort = process.env.PORT;
// eslint-disable-next-line no-process-env
const envConnString = process.env.MONGO;

// Probably contants should be automaticaly adjusted
// to environment ( not explicitly named .dev or .prod )
const config = {
	dev: {
		root: rootPath,
		app: {
			name: 'leisure-project',
		},
		port: envPort || 3000,
		connectionString: envConnString || 'mongodb://localhost:27017/leisureDb',
		secretString: 'Secret magical popcorn',
		defaultProfilePic: '/images/default-user.png',
	},
	production: {
		root: rootPath,
		app: {
			name: 'leisure-project',
		},
		port: envPort,
		connectionString: envConnString,
		secretString: 'Secret magical popcorn',
		defaultProfilePic: '/images/default-user.png',
	},
};

module.exports = config[env];
