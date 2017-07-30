/* globals __dirname */

const path = require('path');
const fs = require('fs');

module.exports = () => {
    const validators = {};

    fs.readdirSync(__dirname)
        .filter((file) => file.includes('-validator.js'))
        .forEach((file) => {
            const requirePath = path.join(__dirname, file);
            const key = file.replace(/(\w+).*/, '$1') + 'Validator';

            validators[key] = require(requirePath);
        });

    return validators;
};
