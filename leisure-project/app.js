const config = require('./config/config');
const logger = require('./config/logger-conf');

const app = require('./config')(logger);

app.then((application) => {
    application.listen(config.port, () =>
        logger.debug('Express server listening on port ' + config.port)
    );
});
