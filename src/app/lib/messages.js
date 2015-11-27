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
  images: {
    1: 'Nice, not too many images :)',
    2: 'Got a few images there!',
    3: 'Getting a bit image heavy there!'
  },
  fonts: {
    1: 'Wicked, not too heavy on the fonts dude.',
    2: 'Do you really need that many fonts?',
    3: 'For real?!?!'
  },
  load: {
    0: 'Looking for a job...?',
    1: 'Sweet! Fast sites are good sites!',
    2: "Not bad, but could do with some improvement. At 4 seconds you're losing 25% of your visitors before the page loads",
    3: 'You know, slow pages are bad for everyone, you really should look at improving this',
    4: 'Oh god... Yeah, you need some help here.'
  },
  html5: {
    5: 'Your HTML could do with updating',
    0: 'Yay, we love HTML5!'
  },
  responsive: {
    5: 'Your site is not mobile ready',
    0: 'Nice mobile ready site'
  },
  accessible: {
    5: 'Your site needs to be made more accessible for disabled people',
    0: 'Nice accessibility work'
  }
};

export default function (type, score) {
  return messages[type][score];
}
