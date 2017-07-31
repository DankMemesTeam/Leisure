/* globals __dirname */

const path = require('path');
const fs = require('fs');

module.exports = (validator) => {
    const baseValidator = require('./base/base-validator')(validator);
    const validators = {};

    fs.readdirSync(__dirname)
        .filter((file) => file.includes('-validator.js'))
        .forEach((file) => {
            // console.log(file);
            if (file.indexOf('base') === -1) {
                const requirePath = path.join(__dirname, file);
                const key = file.replace(/(\w+).*/, '$1') + 'Validator';
                validators[key] = require(requirePath)(baseValidator);
            }
        });

    return validators;
};
