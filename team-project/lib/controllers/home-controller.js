const { Router } = require('express');
const router = new Router();

module.exports = (app) => {
  app.use('/', router);
};

router.get('/', (req, res, next) => {
  // Insert controller here to render the pug
  res.render('home', {
    title: 'Generator-Express MVC',
  });
});
