module.exports = (logger) => {
    const config = require('./config');
    const app = require('./express-conf')(config.dev, logger);

    const express = require('express');
    const db = require('../database').connection(config.dev.connectionString);

    const validator = require('../bin/validator')();
    const hashGenerator = require('../bin/hash-generator');

    const loadedModels = require('../lib/models')();
    const dataConfig = require('./data-conf');
    const data = require('../data')(db, validator, loadedModels, logger, dataConfig);

    const loadedControllers = require('../lib/controllers')(data,
        hashGenerator,
        validator);

    const application = require('./auth-conf')(app,
        data,
        db,
        config.dev.secretString,
        hashGenerator);

    require('../lib/routers')(application, express, loadedControllers);

    const server =
    require('./socket-conf')(application, data, loadedControllers.chatController);

    return server;
};
