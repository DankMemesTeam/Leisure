/* globals __dirname */

const path = require('path');
const fs = require('fs');

module.exports = (app, express, controllers) => {
    fs.readdirSync(__dirname)
        .filter((file) => file.includes('-router.js'))
        .map((file) => path.join(__dirname, file))
        .forEach((modulePath) => {
            require(modulePath)({ app, express, controllers });
        });

    app.use((req, res, next) => {
        // Should be handled by controler... but for now this is okay
        res.status(404)
            .render('page-not-found');
    });
};
