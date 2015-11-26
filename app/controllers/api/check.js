var express = require('express'),
    router = express.Router();

module.exports = function (app) {
  app.use('/', router);
  app.use('/api/check', router);
};

router.post('/api/check', function (req, res, next) {
  res.json({ message: 'Check yourself' });
});
