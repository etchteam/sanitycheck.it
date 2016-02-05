import io from 'socket.io-browserify';
import elementClass from 'element-class';
import css from 'dom-css';

let socket;

function openSocket() {
  socket = io.connect(location.origin.replace(/^http/, 'ws'));

  socket.on('connection', () => ({}));

  socket.on('message', (data) => {
    // Put the message on the page
    if (data.status === 'success' && data.results) {
      for (let i = 0; i < data.results.length; i++) {
        const div = document.createElement('div');
        const h3 = document.createElement('h3');
        const p = document.createElement('p');
        const result = data.results[i];

        elementClass(div).add(`card test-result score-${result.score} test-result-${result.name.replace(' ', '-')}`);
        h3.innerHTML = result.name;
        p.innerHTML = result.message;
        div.appendChild(h3);
        div.appendChild(p);

        if (document.querySelector(`.test-result-${result.name.replace(' ', '-')}`)) {
          document.querySelector('.results')
                  .replaceChild(div, document.querySelector(`.test-result-${result.name.replace(' ', '-')}`));
        } else {
          document.querySelector('.results').appendChild(div);
        }
      }
    } else {
      alert('Oh no the test went up the shitter');
    }
  });
}

function fireUrl(url) {
  // Get rid of the old tests
  const results = document.querySelector('.results');

  while (results.firstChild) {
    results.removeChild(results.firstChild);
  }

  const preResults = document.querySelectorAll('.pre-results');
  const postResults = document.querySelectorAll('.post-results');

  for (let i = 0; i < preResults.length; i++) {
    css(preResults[i], { display: 'none' });
  }

  for (let i = 0; i < postResults.length; i++) {
    css(postResults[i], { display: 'block' });
  }

  socket.emit('newurl', { url });
}

export default function () {
  openSocket();

  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();

    const url = document.getElementById('url').value;
    fireUrl(url);
  });
}
