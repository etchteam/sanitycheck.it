import express from 'express';
import path from 'path';
import phantom from 'phantom';
import phantomjs from 'phantomjs';
import result from '../../models/result';

const router = express.Router();

function testResources(url, socket) {
  const options = {
    path: path.normalize(`${phantomjs.path}/../`),
    parameters: {
      'ignore-ssl-errors': 'yes',
      'ssl-protocol': 'any'
    }
  };

  phantom.create((ph) => {
    ph.createPage((page) => {
      let time = Date.now();
      let js = 0;
      let css = 0;
      let img = 0;
      let fonts = 0;

      const imagePattern = /image\/(?!svg\+xml)/g;
      const cssPattern = /text\/css/g;
      const jsPattern = /(text|application)\/javascript/g;
      const fontPattern = /(application|image)\/(x-font-[a-z]*|font-woff|vnd.ms-fontobject|svg\+xml)/g;

      page.set('onResourceReceived', (res) => {
        res.headers.some((header) => {
          if (header.name === 'Content-Type') {
            const contentType = header.value.toLowerCase();

            if (contentType.match(imagePattern)) {
              img++;
              socket.emit('message', {
                status: 'success',
                results: [
                  result({ name: 'images', value: img })
                ] });
            } else if (contentType.match(cssPattern)) {
              css++;
              socket.emit('message', {
                status: 'success',
                results: [
                  result({ name: 'css', value: css })
                ] });
            } else if (contentType.match(jsPattern)) {
              js++;
              socket.emit('message', {
                status: 'success',
                results: [
                  result({ name: 'js', value: js })
                ] });
            } else if (contentType.match(fontPattern)) {
              fonts++;
              socket.emit('message', {
                status: 'success',
                results: [
                  result({ name: 'fonts', value: fonts })
                ] });
            }

            return true;
          }
        });
      });

      page.open(url, (status) => {
        if (status === 'success') {
          time = Date.now() - time;

          page.evaluate(() => {
            const testResults = {};
            testResults.responsive = document.querySelector('[name="viewport"]') !== null;

            function isHtml5() {
              if (document.doctype === null) {
                return false;
              }

              const node = document.doctype;
              const doctype = `<!DOCTYPE ${node.name}${(node.publicId ? ` PUBLIC "${node.publicId}"` : '')}${(!node.publicId && node.systemId ? ' SYSTEM' : '')}${(node.systemId ? ` "${node.systemId}"` : '')}>`;

              return doctype === '<!DOCTYPE html>';
            }

            testResults.html5 = isHtml5();

            testResults.accessible = document.querySelector('[role]') !== null;

            return testResults;
          }, (testResults) => {
            socket.emit('message', {
              status: 'success',
              results: [
                result({ name: 'responsive', value: testResults.responsive || false }),
                result({ name: 'html5', value: testResults.html5 || false }),
                result({ name: 'accessible', value: testResults.accessible || false }),
                result({ name: 'load', value: time })
              ] });
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

function runTests(url, socket) {
  // Put tests here
  testResources(url, socket);
}

module.exports = (app, io) => {
  app.use('/', router);

  io.on('connection', (socket) => {
    socket.on('newurl', (data) => {
      runTests(data.url, socket);
    });
  });
};
