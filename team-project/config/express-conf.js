/* globals __dirname, undefined*/

const express = require('express');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const minify = require('express-minify');

const expressConf = (config) => {
  const app = express();

  app.set('views', config.root + '/views');
  app.set('view engine', 'pug');
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
  app.use(cookieParser());
  app.use(compress());

  return app;
};

module.exports = expressConf;
