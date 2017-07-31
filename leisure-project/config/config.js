/* globals __dirname, process */

const path = require('path');
const rootPath = path.normalize(__dirname + '/..');

// eslint-disable-next-line no-process-env
const environment = process.env;
// eslint-disable-next-line no-process-env
const environmentPort = process.env.PORT;

// Probably contants should be automaticaly adjusted
// to environment ( not explicitly named .dev or .prod )
const config = {
  development: {
    root: rootPath,
    app: {
      name: 'leisure-project',
    },
    port: environmentPort || 3000,
    // connectionString: 'mongodb://localhost:27017/leisureDb',
    connectionString: 'http://52.57.81.182:27017/',
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
};

// Should take dynamic process env
module.exports = {
  dev: config.development,
  prod: config.production,
};
