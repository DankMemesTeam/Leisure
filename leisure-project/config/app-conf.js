module.exports = (logger) => {
    const config = require('./config');
    const app = require('./express-conf')(config.dev, logger);
    const express = require('express');
    const validator = require('../bin/validator')();
    const hashGenerator = require('../bin/hash-generator');
    const loadedModels = require('../lib/models')();
    const dataConfig = require('./data-conf');


    return require('../database').connection(config.dev.connectionString)
        .then((db) => {
            const data = require('../data')(db, validator, loadedModels, logger, dataConfig);
            const controllers = require('../lib/controllers')(data, hashGenerator, validator);
            const application = require('./auth-conf')(app, data, db, config.dev.secretString, hashGenerator);
            const routes = require('../lib/routers')(application, express, controllers);
            const server = require('./socket-conf')(application, data, controllers.chatController);

            return Promise.resolve(server);
        });
};
