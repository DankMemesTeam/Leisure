module.exports = () => {
    const config = require('./config');
    const app = require('./express-conf')(config.dev);

    const express = require('express');
    const db = require('../database').connection(config.dev.connectionString);

    const loadedControllers = require('../lib/controllers')();
    const data = require('../data')(db);

    // Routers should take app, data, controllers and logger in the contructor
    require('../lib/routers')(app, express, data, loadedControllers);

    return app;
};
