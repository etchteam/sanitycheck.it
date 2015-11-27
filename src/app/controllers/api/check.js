import express from 'express';
import path from 'path';
import phantom from 'phantom';
import phantomjs from 'phantomjs';
import io from 'socket.io';
import result from '../../models/result';

var router = express.Router();

function testResources(url, socket) {

  var options = {
    path: path.normalize(phantomjs.path + '/..' + '/'),
    parameters: {
      'ignore-ssl-errors': 'yes',
      'ssl-protocol': 'any'
    }
  };

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
                  result({ name: 'images', value: img })
                ]});
            } else if (contentType.match(cssPattern)) {
              css++;
              socket.emit('message', {
                status: 'success',
                results: [
                  result({ name: 'css', value: css })
                ]});
            } else if (contentType.match(jsPattern)) {
              js++;
              socket.emit('message', {
                status: 'success',
                results: [
                  result({ name: 'js', value: js })
                ]});
            } else if (contentType.match(fontPattern)) {
              fonts++;
              socket.emit('message', {
                status: 'success',
                results: [
                  result({ name: 'fonts', value: fonts })
                ]});
            }

            return true;
          }
        });
      });

      page.open(url, function (status) {
        if (status == 'success') {
          time = Date.now() - time;

          page.evaluate(function(){
            var testResults = {};
            testResults.responsive = (document.querySelector('[name="viewport"]')) ? true : false;

            var is_html5 = function () {
              if (document.doctype === null) return false;

              var node = document.doctype;
              var doctype_string = "<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC"' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + ">";

              return doctype_string === '<!DOCTYPE html>';
            };

            testResults.html5 = is_html5();

            testResults.accessible = (document.querySelector('[role]')) ? true : false;

            return testResults;

          },function(testResults){
            socket.emit('message', {
              status: 'success',
              results: [
                result({ name: 'responsive', value: testResults.responsive }),
                result({ name: 'html5', value: testResults.html5 }),
                result({ name: 'accessible', value: testResults.accessible }),
                result({ name: 'load', value: time })
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
  }, options);
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
    });

  });
};
