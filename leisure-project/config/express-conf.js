/* globals undefined*/
/* eslint no-undefined: 0 */

const express = require('express');

const bodyParser = require('body-parser');
const minify = require('express-minify');

module.exports = (config, logger) => {
  const app = express();
  logger.debug('Creating Express application...');

  app.set('views', config.root + '/views');

  app.set('view engine', 'pug');
  logger.debug('Setting Pug to default view engine...');

  app.use(express.static(config.root + '/public'));

  app.use(minify({
    css_match: /css/,
    json_match: /json/,
    uglifyJS: undefined,
    cssmin: undefined,
    cache: false,
    onerror: undefined,
  }));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));

  return app;
};
