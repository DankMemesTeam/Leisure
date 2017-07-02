/* globals __dirname, process */

const path = require('path');
const rootPath = path.normalize(__dirname + '/..');

// eslint-disable-next-line no-process-env
const environmentPort = process.env.PORT;

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'team-project',
    },
    port: environmentPort || 3000,
  },
  production: {
    root: rootPath,
    app: {
      name: 'team-project',
    },
    port: environmentPort || 3001,
  },
};

module.exports = {
  dev: config.development,
  prod: config.production,
};
