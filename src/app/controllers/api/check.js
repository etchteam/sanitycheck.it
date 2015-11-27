import express from 'express';
import path from 'path';
import childProcess from 'child_process';
import phantom from 'phantom';
import bodyParser from 'body-parser';
import io from 'socket.io';

var router = express.Router();
var jsonParser = bodyParser.json();

module.exports = function (app) {
  app.use('/', router);

  var server = require('http').Server(app);
  var io = require('socket.io').listen(server);

  server.listen(9000);

  io.on('connection', function (socket) {
    console.log('socket connected');
    socket.on('newurl', function (data) {
      console.log(data);
      socket.emit('message', data);
    });
  });
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


