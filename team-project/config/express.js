const express = require('express');
const glob = require('glob');

// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');

module.exports = function(app, config) {
  const env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env === 'development';

  app.set('views', config.root + '/app/views');
  app.set('view engine', 'pug');

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(config.root + '/public'));


  // Not going to be needed later as separate routers will call different controllers
  // and controller call logic won`t be in app.js
  const controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function(controller) {
    require(controller)(app);
  });

  app.use(function(req, res, next) {
    const err = new Error('Not Found.');
    err.status = 404;
    next(err);
  });

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
