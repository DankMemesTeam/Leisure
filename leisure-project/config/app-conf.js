module.exports = (logger) => {
    const config = require('./config');
    const app = require('./express-conf')(config.dev, logger);

    const express = require('express');
    const db = require('../database').connection(config.dev.connectionString);

    const data = require('../data')(db);
    // Since some controllers need data

    const loadedControllers = require('../lib/controllers')(data);

    // Load auth before routes, or rip
    require('./auth-conf')(app, data, db, config.dev.secretString);

    // Routers should take app, data, controllers and logger in the contructor
    require('../lib/routers')(app, express, loadedControllers);

    return app;
};
