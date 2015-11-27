import io from 'socket.io-browserify';

var socket;

function openSocket(){
  socket = io.connect('http://localhost:9000');

  socket.on('connection', function (socket) {
    console.log('Socket ready');
  });

  socket.on('message', function (data) {
    // Put the message on the page
    console.log(data);
  });
}

function fireUrl(url){
  socket.emit('newurl', { url: url });
}

export default function(){
  openSocket();
  document.querySelector('form').addEventListener('submit',function(e){
    e.preventDefault();
    var url = document.getElementById('url').value;
    fireUrl(url);
  });
}
