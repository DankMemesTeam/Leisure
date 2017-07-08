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
    const splittedPath = modulePath.split('\\');
    const dataNamePart = splittedPath[splittedPath.length - 1];

    const cutIndex = dataNamePart.indexOf('-model.js');
    let modelName = dataNamePart.substring(0, cutIndex);

    modelName = modelName.substring(0, 1).toUpperCase() +
        modelName.substring(1);
    return modelName;
};