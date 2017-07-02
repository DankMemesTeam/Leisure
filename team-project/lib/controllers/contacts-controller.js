const { Router } = require('express');
const router = new Router();

module.exports = (app) => {
  app.use('/contacts', router);
};

router.get('/:id', (req, res, next) => {
  res.render('contacts', {
    title: 'Generator-Express MVCC',
    id: req.params.id,
  });
});
