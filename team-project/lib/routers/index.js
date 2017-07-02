/* globals __dirname */

const path = require('path');
const fs = require('fs');
const homeController = require('../controllers/home-controller');

// Functions for loading all controller by name should be created
const loadRouters = (app) => {
    // fs.readdirSync(__dirname)
    //     .filter((file) => file.includes('-router.js'))
    //     .map((file) => path.join(__dirname, file))
    //     .forEach((modulePath) => {
    //         require(modulePath)(app);
    //     });

    // With the upper commented function every router will be provided only the needed controller !!!
    require('./home-router')(app, homeController);

    app.use((req, res, next) => {
        // Should be handled by controler... but for now this is okay
        res.status(404)
            .render('page-not-found');
    });
};

module.exports = loadRouters;
