var express = require('express'),
  router = express.Router();

module.exports = function (app) {
  app.use('/', router);
  app.use('/about', router);
};

router.get('/', function (req, res, next) {
    res.render('index', {
      title: 'SanityCheck.it'
    });
});

router.get('/about', function (req, res, next) {
  res.render('about', {
    title: 'About'
  });
});
