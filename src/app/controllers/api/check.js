import express from 'express';
import path from 'path';
import childProcess from 'child_process';
import phantom from 'phantom';
import bodyParser from 'body-parser';
import io from 'socket.io';

var router = express.Router();
var jsonParser = bodyParser.json();

var message = function (type, value) {
  var message = '';

  if (type == 'css') {
    if (value <= 2) {
      message = 'Sweet! You do css well!';
    } else if (value <= 4) {
      message = 'Eh, got some room for improvement dude.';
    } else {
      message = 'Esch, doing it wrong.';
    }
  } else if (type == 'js') {
    if (value <= 2) {
      message = 'Hell yeah, keep it minimal!';
    } else if (value <= 4) {
      message = 'Not bad!';
    } else {
      message = "Aw no, this isn't going well :(";
    }
  } else if (type == 'img') {
    if (value <= 10) {
      message = 'Nice, not too many images :)';
    } else if (value <= 20) {
      message = 'Got a few images there!';
    } else {
      message = 'Getting a bit image heavy there!';
    }
  } else if (type == 'fonts') {
    if (value <= 2) {
      message = 'Wicked, not too heavy on the fonts dude.';
    } else if (value <= 4) {
      message = value + ' fonts? Do you really need that many?';
    } else {
      message = value + ' fonts?! For real?!?!';
    }
  } else if (type == 'load') {
    if (value <= 1000) {
      message = 'Looking for a job...?';
    } else if (value <= 2000) {
      message = 'Sweet! Fast sites are good sites!';
    } else if (value <= 4000) {
      message = "Not bad, but could do with some improvement. At 4 seconds you're losing 25% of your visitors before the page loads";
    } else if (value <= 8000) {
      message = 'You know, slow pages are bad for everyone, you really should look at improving this';
    } else {
      message = 'Oh god... Yeah, you need some help here.';
    }
  }

  return message;
};

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
