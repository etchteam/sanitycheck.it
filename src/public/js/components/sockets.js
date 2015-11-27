import io from 'socket.io-browserify';
import elementClass from 'element-class';

var socket;

function openSocket(){
  socket = io.connect('http://localhost:9000');

  socket.on('connection', function (socket) {
    console.log('Socket ready');
  });

  socket.on('message', function (data) {
    // Put the message on the page
    console.log(data);

    if (data.status == 'success' && data.results) {
      for(var i=0;i<data.results.length;i++) {
        let div = document.createElement('div'),
            h3 = document.createElement('h3'),
            p = document.createElement('p'),
            result = data.results[i];

        if (result.pass) {
          elementClass(div).add('card alert-info');
        } else {
          elementClass(div).add('card alert-warning');
        }
        h3.innerHTML = result.name;
        p.innerHTML = result.message;
        div.appendChild(h3);
        div.appendChild(p);

        document.querySelector('.results').appendChild(div);
      }
    }
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
