/* globals __dirname */

const path = require('path');
const fs = require('fs');

module.exports = (data, hashGenerator) => {
    const controllers = {};

    fs.readdirSync(__dirname)
        .filter((file) => file.includes('-controller.js'))
        .map((file) => path.join(__dirname, file))
        .forEach((modulePath) => {
            const normalizedName = normalizeModuleName(modulePath);
            const loadedModule = require(modulePath)(data, hashGenerator);

            controllers[normalizedName] = loadedModule;
        });

    return controllers;
};

const normalizeModuleName = (modulePath) => {
    const splittedPath = modulePath.split('\\');
    const controllerNamePart = splittedPath[splittedPath.length - 1];

    const cutIndex = controllerNamePart.indexOf('-controller');
    const controllerName = controllerNamePart.substring(0, cutIndex);

    const normalizedName = controllerName + 'Controller';
    return normalizedName;
};
