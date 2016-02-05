const messages = {
  css: {
    1: 'Nice, not too many CSS files.',
    2: 'Look at concatenating your CSS for faster page load.',
    3: 'This is loading too many CSS files!'
  },
  js: {
    1: 'Awesome, you don\'t load too many JS files.',
    2: 'See if you can group your JS files for faster page load.',
    3: "You are loading too many JS files, it\'s gonna make your page slow."
  },
  images: {
    1: 'Nice, not too many images :)',
    2: 'Got a few images there!',
    3: 'Getting a bit image heavy there!'
  },
  fonts: {
    1: 'Wicked, not too heavy on the fonts dude.',
    2: 'Do you really need that many fonts?',
    3: 'You have too many fonts. it\'s slowing your page down.'
  },
  load: {
    0: 'Wow that was fast! Looking for a job...?',
    1: 'Sweet! Fast sites are good sites!',
    2: "At 4 seconds you're losing 25% of your visitors before the page loads.",
    3: 'You know, slow pages are bad for everyone, you really should look at improving this.',
    4: 'Oh god... Yeah, you need some help here.'
  },
  html5: {
    4: 'Your HTML could do with updating.',
    0: 'Yay, we love HTML5! Nice and modern.'
  },
  responsive: {
    4: 'Your site is not mobile ready.',
    0: 'Nice mobile ready site.'
  },
  accessible: {
    4: 'Your site needs to be made more accessible for people with disabilities.',
    0: 'Nice accessibility work.'
  }
};

export default function (type, score) {
  return messages[type][score];
}
