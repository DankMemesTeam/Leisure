module.exports = () => {
    const pug = require('pug');

    return {
        render(templateName, templateObj) {
            return new Promise((resolve, reject) => {
                const compiledTemplate =
                    pug.renderFile(`../dynamic/${templateName}.pug`,
                     templateObj);

                resolve(compiledTemplate);
            });
        },
    };
};


