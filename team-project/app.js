let express = require('express'),
  config = require('./config/config');

const app = express();

app.use(express.static(__dirname + '/public'));

module.exports = require('./config/express')(app, config);

app.listen(config.port, function() {
  console.log('Express server listening on port ' + config.port);
});

