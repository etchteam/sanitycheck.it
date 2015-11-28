export default function (name, value) {
  var score = 3;

  switch (name) {
    case 'css':
    case 'js':
    case 'fonts':
      if (value <= 2) {
        score = 1;
      } else if (value <= 4) {
        score = 2;
      } else {
        score = 3;
      }
      break;
    case 'images':
      if (value <= 10) {
        score = 1;
      } else if (value <= 20) {
        score = 2;
      } else {
        score = 3;
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
    case 'html5':
      score = (value) ? 0 : 4;
      break;
    case 'responsive':
      score = (value) ? 0 : 4;
      break;
    case 'accessible':
      score = (value) ? 0 : 4;
      break;
  }

  return score;
}
