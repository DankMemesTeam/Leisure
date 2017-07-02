/* globals __dirname */

const express = require('express');
const glob = require('glob');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const minify = require('express-minify');

const expressConf = (config) => {
  const app = express();

  const env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env === 'development';

  app.set('views', config.root + '/lib/views');
  app.set('view engine', 'pug');
  app.use(express.static(config.root + '/public'));

  app.use(minify({
    js_match: /javascript/,
    css_match: /css/,
    json_match: /json/,
    uglifyJS: undefined,
    cssmin: undefined,
    cache: false,
    onerror: undefined,
  }));

  // app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(cookieParser());
  app.use(compress());

  // app.use((req, res, next) => {
  //   const err = new Error('Not Found.');
  //   err.status = 404;
  //   next(err);
  // });

  // if (app.get('env') === 'development') {
  //   app.use(function(err, req, res, next) {
  //     res.status(err.status || 500);
  //     res.render('error', {
  //       message: err.message,
  //       error: err,
  //       title: 'error',
  //     });
  //   });
  // }

  // app.use(function(err, req, res, next) {
  //   res.status(err.status || 500);
  //     res.render('error', {
  //       message: err.message,
  //       error: {},
  //       title: 'error',
  //     });
  // });

  return app;
};

module.exports = expressConf;
