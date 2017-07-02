const appConf = () => {
    const config = require('./config');
    const app = require('./express-conf')(config);

    require('../lib/controllers')(app);

    return app;
};

module.exports = appConf;
