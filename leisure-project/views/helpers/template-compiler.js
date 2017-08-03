/* globals __dirname */

module.exports = () => {
    const pug = require('pug');
    const path = require('path');

    return {
        render(templateName, templateObj) {
            return new Promise((resolve, reject) => {
                const filePath = path.join(__dirname, `../dynamic/${templateName}.pug`);

                const compiledTemplate =
                    pug.renderFile(filePath,
                     templateObj);

                resolve(compiledTemplate);
            });
        },
    };
};


