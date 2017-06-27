const express = require('express');
const router = express.Router();

module.exports = function(app) {
  app.use('/contacts', router);
};

router.get('/:id', function(req, res, next) {
  // ENTRY POINT
  res.render('contacts', {
    title: 'Generator-Express MVC',
    id: req.params.id,
  });
});


// api/users
// api/asd
