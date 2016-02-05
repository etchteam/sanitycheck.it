import express from 'express';
import path from 'path';
import phantom from 'phantom';
import phantomjs from 'phantomjs';
import result from '../../models/result';

const router = express.Router();
let webSocket;

function sendMessage(message, status = 'success') {
  const data = {
    status
  };

  if (Array.isArray(message)) {
    data.results = message;
  } else {
    data.results = [message];
  }

  webSocket.emit('message', data);
}

function testResources(url) {
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
              const message = result({ name: 'images', prettyName: 'Number of images', value: img });
              sendMessage(message);
            } else if (contentType.match(cssPattern)) {
              css++;
              const message = result({ name: 'css', prettyName: 'Number of CSS files', value: css });
              sendMessage(message);
            } else if (contentType.match(jsPattern)) {
              js++;
              const message = result({ name: 'js', prettyName: 'Number of javascript files', value: js });
              sendMessage(message);
            } else if (contentType.match(fontPattern)) {
              fonts++;
              const message = result({ name: 'fonts', prettyName: 'Number of fonts', value: fonts });
              sendMessage(message);
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

            function isHtml5() {
              const node = document.doctype;

              if (node === null) {
                return false;
              }

              const doctype = `<!DOCTYPE ${node.name}${(node.publicId ? ` PUBLIC "${node.publicId}"` : '')}${(!node.publicId && node.systemId ? ' SYSTEM' : '')}${(node.systemId ? ` "${node.systemId}"` : '')}>`;
              return doctype === '<!DOCTYPE html>';
            }

            testResults.html5 = isHtml5();
            testResults.responsive = document.querySelector('[name="viewport"]') !== null;
            testResults.accessible = document.querySelector('[role]') !== null;

            return testResults;
          }, (testResults) => {
            const message = [
              result({ name: 'responsive', prettyName: 'Mobile ready', value: testResults.responsive }),
              result({ name: 'html5', prettyName: 'Modern HTML', value: testResults.html5 }),
              result({ name: 'accessible', prettyName: 'Accessibility', value: testResults.accessible }),
              result({ name: 'load', prettyName: 'Load time', value: time })
            ];
            sendMessage(message);
            ph.exit();
          });
        } else {
          sendMessage('', 'failed');
        }
      });
    });
  }, options);
}

module.exports = (app, io) => {
  app.use('/', router);

  io.on('connection', (socket) => {
    webSocket = socket;
    webSocket.on('newurl', (data) => {
      testResources(data.url);
    });
  });
};
