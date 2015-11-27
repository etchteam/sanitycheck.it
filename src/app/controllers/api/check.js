import express from 'express';
import path from 'path';
import childProcess from 'child_process';
import phantomjs from 'phantomjs';

var router = express.Router();
var binPath = phantomjs.path;

module.exports = function (app) {
  app.use('/', router);
};

router.post('/api/check', function (req, res, next) {
  var childArgs = [
    path.normalize(__dirname + '/../../lib/checker.js'),
  ];

  childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
    if (err || stderr) {
      res.sendStatus(500);
    }

    //console.log(stdout);
  });

  res.json({ params: req.body });
});
