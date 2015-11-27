WebFontConfig = {
  google: { families: [ 'Roboto+Slab:300,400,700:latin', 'Roboto:300,400,700,300:latin' ] }
};
(function() {
  var wf = document.createElement('script');
  wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
    '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
})();

var WebSocket = require('ws');
var ws = new WebSocket('ws://localhost:3000/api/check');

console.log(ws);

ws.onopen = function open(e) {
  console.log('ws open');
  ws.send('something');
};

ws.onmessage = function(data, flags) {
  // flags.binary will be set if a binary data is received.
  // flags.masked will be set if the data was masked.
  console.log(data,flags);
};
