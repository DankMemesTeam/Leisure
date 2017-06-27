let express = require('express'),
  router = express.Router(),
  Article = require('../models/article');

module.exports = function(app) {
  app.use('/', router);
};

router.get('/', function(req, res, next) {
  const articles = [new Article(), new Article()];
    res.render('index', {
      title: 'Generator-Express MVC',
      articles: articles,
    });
});
