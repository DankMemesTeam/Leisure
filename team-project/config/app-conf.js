module.exports = () => {
    const express = require('express');

    const config = require('./config');
    const app = require('./express-conf')(config.dev);

    const loadedControllers = require('../lib/controllers')();
    const data = require('../data');

    // Routers should take app, data, controllers and logger in the contructor
    require('../lib/routers')(app, express, data, loadedControllers);

    return app;
};
