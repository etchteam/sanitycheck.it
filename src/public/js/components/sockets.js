import io from 'socket.io-browserify';

function openSocket(){
  var socket = io.connect('http://localhost:9000');
  console.log(socket);
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });
}

export default function(){
  document.querySelector('form').addEventListener('submit',function(e){
    e.preventDefault();
  });
}
