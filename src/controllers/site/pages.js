import express from 'express';

var router = express.Router();

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  console.log('test');

  res.render('index', {
    title: 'SanityCheck.it'
  });
});

router.get('/about', function (req, res, next) {
  res.render('about', {
    title: 'About'
  });
});
