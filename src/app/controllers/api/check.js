import express from 'express';
import path from 'path';
import childProcess from 'child_process';
import phantom from 'phantom';
import bodyParser from 'body-parser';
import io from 'socket.io';
import message from '../../lib/messages';

var router = express.Router();
var jsonParser = bodyParser.json();

function testResources(url,socket){
  var url = url;

  phantom.create(function (ph) {
    ph.createPage(function (page) {
      var time = Date.now();
      var js = 0;
      var css = 0;
      var img = 0;
      var fonts = 0;

      var imagePattern = /image\/(?!svg\+xml)/g;
      var cssPattern = /text\/css/g;
      var jsPattern = /(text|application)\/javascript/g;
      var fontPattern = /(application|image)\/(x-font-[a-z]*|font-woff|vnd.ms-fontobject|svg\+xml)/g

      page.set('onResourceReceived', function (res) {
        res.headers.some(function (header) {
          if (header.name == 'Content-Type') {
            var contentType = header.value.toLowerCase();

            if (contentType.match(imagePattern)) {
              img++;
              socket.emit('message', {
                status: 'success',
                results: [
                  { name: 'images', pass: true, value: img, message: message('img', img) }
                ]});
            } else if (contentType.match(cssPattern)) {
              css++;
              socket.emit('message', {
                status: 'success',
                results: [
                  { name: 'css', pass: css < 4, value: css, message: message('css', css) }
                ]});
            } else if (contentType.match(jsPattern)) {
              js++;
              socket.emit('message', {
                status: 'success',
                results: [
                  { name: 'js', pass: js < 4, value: js, message: message('js', js) }
                ]});
            } else if (contentType.match(fontPattern)) {
              fonts++;
              socket.emit('message', {
                status: 'success',
                results: [
                  { name: 'fonts', pass: true, value: fonts, message: message('fonts', fonts) }
                ]});
            }

            return true;
          }
        });
      });

      page.open(url, function (status) {
        if (status == 'success') {
          time = Date.now() - time;

          page.evaluate(function () {
            return document.title;
          }, function (result) {
            socket.emit('message', {
              status: 'success',
              results: [
                { name: 'load', pass: time < 4000, value: time, message: message('load', time) },
                { name: 'js', pass: js < 4, value: js, message: message('js', js) },
                { name: 'css', pass: css < 4, value: css, message: message('css', css) },
                { name: 'images', pass: true, value: img, message: message('img', img) },
                { name: 'fonts', pass: true, value: fonts, message: message('fonts', fonts) }
              ]});
            ph.exit();
          });
        } else {
          socket.emit('message', {
            status: 'failed'
          });
        }
      });
    });

  });
}

function runTests(url,socket) {
  // Put tests here
  testResources(url,socket);
}

module.exports = function (app) {
  app.use('/', router);

  var server = require('http').Server(app);
  var io = require('socket.io').listen(server);

  server.listen(9000);

  io.on('connection', function (socket) {
    console.log('socket connected');

    socket.on('newurl', function (data) {
      runTests(data.url,socket);
      console.log(data);
      //socket.emit('message', data);
    });

  });
};
