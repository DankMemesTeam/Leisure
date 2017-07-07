module.exports = (logger) => {
    const config = require('./config');
    const app = require('./express-conf')(config.dev, logger);

    const express = require('express');
    const db = require('../database').connection(config.dev.connectionString);

    const validator = require('../bin/validator')();
    const loadedModels = require('../lib/models')();
    const data = require('../data')(db, validator, loadedModels, logger);

    const loadedControllers = require('../lib/controllers')(data);

    require('./auth-conf')(app, data, db, config.dev.secretString);

    // Routers should take app, data, controllers and logger in the contructor
    require('../lib/routers')(app, express, loadedControllers);

    return app;
};
