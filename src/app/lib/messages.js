var messages = {
  css: {
    1: 'Sweet! You do css well!',
    2: 'Eh, got some room for improvement dude.',
    3: 'Esch, doing it wrong.'
  },
  js: {
    1: 'Hell yeah, keep it minimal!',
    2: 'Not bad!',
    3: "Aw no, this isn't good :("
  },
  img: {
    1: 'Nice, not too many images :)',
    2: 'Got a few images there!',
    3: 'Getting a bit image heavy there!'
  },
  fonts: {
    1: 'Wicked, not too heavy on the fonts dude.',
    2: ' fonts? Do you really need that many?',
    3: ' fonts?! For real?!?!'
  },
  load: {
    0: 'Looking for a job...?',
    1: 'Sweet! Fast sites are good sites!',
    2: "Not bad, but could do with some improvement. At 4 seconds you're losing 25% of your visitors before the page loads",
    3: 'You know, slow pages are bad for everyone, you really should look at improving this',
    4: 'Oh god... Yeah, you need some help here.'
  }
};

var message = function (type, value) {
  var score = 3;

  switch (type) {
    case 'css':
    case 'js':
    case 'fonts':
      if (value <= 2) {
        score = 1;
      } else if (value <= 4) {
        score = 2;
      }
      break;
    case 'img':
      if (value <= 10) {
        score = 1;
      } else if (value <= 20) {
        score = 2;
      }
      break;
    case 'load':
      if (value <= 1000) {
        score = 0;
      } else if (value <= 2000) {
        score = 1;
      } else if (value <= 4000) {
        score = 2;
      } else if (value <= 8000) {
        score = 3;
      } else {
        score = 4;
      }
      break;
  }

  return messages[type][score];
};

export default function (type, value) {
  return message(type, value);
}
