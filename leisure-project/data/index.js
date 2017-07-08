/* globals __dirname */

const path = require('path');
const fs = require('fs');

const collectionsModule = require('../database').collections;

// Should be passed either the db or the specific collction to work with
module.exports = (db, validator, loadedModels, logger) => {
    const data = {};

    fs.readdirSync(__dirname)
        .filter((file) => file.includes('-data.js'))
        .map((file) => path.join(__dirname, file))
        .forEach((modulePath) => {
            const normalizedName = normalizeModuleName(modulePath);
            console.log('MODEL NAME ' + normalizedName);
            const collectionToUse = collectionsModule(db, normalizedName);

            const loadedModule = require(modulePath)(collectionToUse, validator,
            loadedModels, logger);

            data[normalizedName] = loadedModule;
        });

    return data;
};

const normalizeModuleName = (modulePath) => {
    const splittedPath = modulePath.split('\\');
    const dataNamePart = splittedPath[splittedPath.length - 1];

    const cutIndex = dataNamePart.indexOf('-data.js');
    const dataName = dataNamePart.substring(0, cutIndex);

    const normalizedName = dataName + 'Data';
    return normalizedName;
};
