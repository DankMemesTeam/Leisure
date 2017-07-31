module.exports = (logger) => {
    const validator = require('validator');

    const config = require('./config');
    const app = require('./express-conf')(config.dev, logger);
    const express = require('express');
    const validators = require('../validators')(validator);
    const hashGenerator = require('../bin/hash-generator');
    const loadedModels = require('../lib/models')();
    const dataConfig = require('./data-conf');


    return require('../database').connection(config.dev.connectionString)
        .then((db) => {
            const data = require('../data')(db, validators, loadedModels, logger, dataConfig);
            const controllers = require('../lib/controllers')(data, hashGenerator, validators);
            const application = require('./auth-conf')(app, data, db, config.dev.secretString, hashGenerator);
            const routes = require('../lib/routers')(application, express, controllers);
            const server = require('./socket-conf')(application, data, controllers.chatController);

            // REMOVE VALIDATORS FUNCTION CALL IF NOT USING VALIDATION LIBRARY

            // Move somewhere appropriate
            app.use((err, req, res, next) => {
                return res.redirect('/');
            });

            return Promise.resolve(server);
        });
};
