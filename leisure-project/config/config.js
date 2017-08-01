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
<<<<<<< HEAD
  development: {
    root: rootPath,
    app: {
      name: 'leisure-project',
    },
    port: environmentPort || 3000,
    connectionString: 'mongodb://localhost:27017/leisureDb',
    // connectionString: 'mongodb://52.57.81.182:27017/leisureDb',
    secretString: 'Secret magical popcorn',
    defaultProfilePic: '/images/default-user.png',
  },
  production: {
    root: rootPath,
    app: {
      name: 'leisure-project',
    },
    port: environmentPort || 3001,
    // Not sure about the syntax about this one
    connectionString: environment.connectionString,
    defaultProfilePic: '/images/default-user.png',
  },
=======
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
>>>>>>> 49fc1dd59e6f0888f99ee21be8a8b1da57133967
};

module.exports = config[env];
