import express from 'express';
import path from 'path';
import childProcess from 'child_process';
import phantom from 'phantom';
import bodyParser from 'body-parser';

var router = express.Router();
var jsonParser = bodyParser.json();

module.exports = function (app) {
  app.use('/', router);
};

router.post('/api/check', jsonParser, function (req, res, next) {
  var url = req.body.url;

  phantom.create(function (ph) {
    ph.createPage(function (page) {
      page.open(url, function (status) {
        if (status == 'success') {
          page.evaluate(function () {
            return document.title;
          }, function (result) {
            res.json({ url: url, title: result });
            ph.exit();
          });
        } else {
          res.sendStatus(500);
        }
      });
    });
  });
});
