/* globals __dirname */

const path = require('path');
const fs = require('fs');

module.exports = () => {
    const models = {};

    fs.readdirSync(__dirname)
        .filter((file) => file.includes('-model.js'))
        .map((file) => path.join(__dirname, file))
        .forEach((modulePath) => {
            const normalizedName = normalizeModuleName(modulePath);

            const loadedModule = require(modulePath);
            models[normalizedName] = loadedModule;
        });

    return models;
};

const normalizeModuleName = (modulePath) => {
    const modelName = modulePath.replace(/.*models[\/\\](.*)-.*/, '$1');
    const result = modelName.substr(0, 1).toUpperCase() + modelName.substr(1);

    return result;
};
