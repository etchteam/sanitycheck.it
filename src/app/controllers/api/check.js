import express from 'express';
import path from 'path';
import childProcess from 'child_process';
import phantomjs from 'phantomjs';
import bodyParser from 'body-parser';

var router = express.Router();
var binPath = phantomjs.path;
var jsonParser = bodyParser.json();

module.exports = function (app) {
  app.use('/', router);
};

router.post('/api/check', jsonParser, function (req, res, next) {
  var url = req.body.url;

  var childArgs = [
    path.normalize(__dirname + '/../../lib/checker.js'),
  ];

  childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
    if (err || stderr) {
      res.sendStatus(500);
    }

    //console.log(stdout);
  });

  res.json({ url: url });
});
