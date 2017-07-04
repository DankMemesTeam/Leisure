const appConf = () => {
    const config = require('./config');
    const app = require('./express-conf')(config.dev);

    // const controllers = require('../lib/controllers');

    // Routers should take app, data, controllers and logger in the contructor
    require('../lib/routers')(app);

    return app;
};

module.exports = appConf;
