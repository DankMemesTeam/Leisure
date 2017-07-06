module.exports = () => {
    const config = require('./config');
    const app = require('./express-conf')(config.dev);

    const express = require('express');
    const db = require('../database').connection(config.dev.connectionString);

    const data = require('../data')(db);
    // Since some controllers need data

    const loadedControllers = require('../lib/controllers')(data);

    // Load auth before routes, or rip
    require('../lib/auth')(app, data, db, 'Secret');

    // Routers should take app, data, controllers and logger in the contructor
    require('../lib/routers')(app, express, data, loadedControllers);

    return app;
};
