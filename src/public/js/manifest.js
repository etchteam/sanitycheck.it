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

var io = require('socket.io-browserify');

var socket = io.connect('http://localhost:9000');
console.log(socket);
socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});
