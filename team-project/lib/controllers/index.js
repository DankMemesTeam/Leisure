/* globals __dirname */

const path = require('path');
const fs = require('fs');

const attachControllers = (app) => {
    fs.readdirSync(__dirname)
        .filter((file) => file.includes('-controller.js'))
        .map((file) => path.join(__dirname, file))
        .forEach((modulePath) => {
            require(modulePath)(app);
        });

    app.use((req, res, next) => {
        // Should be handled by controler... but for now this is okay
        res.status(404)
            .render('page-not-found');
    });
};

module.exports = attachControllers;
