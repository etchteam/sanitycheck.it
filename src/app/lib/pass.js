export default function (name, value) {
  var pass = false;

  switch (name) {
    case 'css':
      pass = value < 4;
      break;
    case 'js':
      pass = value < 4;
      break;
    case 'fonts':
      pass = value < 3;
      break;
    case 'images':
      pass = true;
      break;
    case 'load':
      pass = value <= 4000;
      break;
    case 'html5':
      pass = value;
      break;
    case 'responsive':
      pass = value;
      break;
    case 'accessible':
      pass = value;
      break;
  }

  return pass;
};
