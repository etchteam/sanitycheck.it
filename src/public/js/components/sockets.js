import io from 'socket.io-browserify';
import elementClass from 'element-class';
import css from 'dom-css';

var socket;

function openSocket(){
  socket = io.connect(location.origin.replace(/^http/, 'ws'));

  socket.on('connection', function (socket) { });

  socket.on('message', function (data) {

    // Put the message on the page
    if (data.status == 'success' && data.results) {
      for(var i=0;i<data.results.length;i++) {
        let div = document.createElement('div'),
            h3 = document.createElement('h3'),
            p = document.createElement('p'),
            result = data.results[i];

        if (result.pass) {
          elementClass(div).add('card test-result score-'+result.score+' test-result-'+result.name.replace(' ','-'));
        } else {
          elementClass(div).add('card test-result score-'+result.score+' test-result-'+result.name.replace(' ','-'));
        }
        h3.innerHTML = result.name;
        p.innerHTML = result.message;
        div.appendChild(h3);
        div.appendChild(p);

        if (document.querySelector('.test-result-'+result.name.replace(' ','-'))) {
          document.querySelector('.results').replaceChild(div,document.querySelector('.test-result-'+result.name.replace(' ','-')));
        } else {
          document.querySelector('.results').appendChild(div);
        }
      }
    } else {
      alert('Oh no the test went up the shitter');
    }
  });
}

function fireUrl(url){
  // Get rid of the old tests
  var results = document.querySelector('.results');

  while (results.firstChild) {
    results.removeChild(results.firstChild);
  }

  let preResults = document.querySelectorAll('.pre-results'),
      postResults = document.querySelectorAll('.post-results');

  for (var i=0;i<preResults.length;i++) {
    css(preResults[i],{'display': 'none'});
  }

  for (var i=0;i<postResults.length;i++) {
    css(postResults[i],{'display': 'block'});
  }

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
