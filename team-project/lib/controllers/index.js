/* globals __dirname */

const path = require('path');
const fs = require('fs');

const loadControllers = (app) => {
    fs.readdirSync(__dirname)
        .filter((file) => file.includes('-controller.js'))
        .map((file) => path.join(__dirname, file))
        .forEach((modulePath) => {
            require(modulePath)(app);
        });
};

module.exports = loadControllers;
