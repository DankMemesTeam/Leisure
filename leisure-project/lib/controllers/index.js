/* globals __dirname */

const path = require('path');
const fs = require('fs');
const renderer = require('../../views/helpers/template-compiler')();

module.exports = (data, hashGenerator, validator) => {
    const controllers = {};

    fs.readdirSync(__dirname)
        .filter((file) => file.includes('-controller.js'))
        .map((file) => path.join(__dirname, file))
        .forEach((modulePath) => {
            const normalizedName = normalizeModuleName(modulePath);
            const loadedModule = require(modulePath)(data,
                renderer,
                hashGenerator,
                validator);

            controllers[normalizedName] = loadedModule;
        });

    return controllers;
};

const normalizeModuleName = (modulePath) => {
    // const splittedPath = modulePath.split('\\');
    // const controllerNamePart = splittedPath[splittedPath.length - 1];

    // const cutIndex = controllerNamePart.indexOf('-controller');
    // const controllerName = controllerNamePart.substring(0, cutIndex);

    // const normalizedName = controllerName + 'Controller';

    const normalizedName = modulePath.replace(/.*controllers[\/\\](.*)-.*/, '$1') + 'Controller';

    return normalizedName;
};
