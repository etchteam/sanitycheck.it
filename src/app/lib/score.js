import moment from 'moment';

export default function (name, value) {
  let score = 3;

  switch (name) {
    case 'css':
    case 'js':
      if (value <= 4) {
        score = 1;
      } else if (value <= 6) {
        score = 2;
      } else {
        score = 3;
      }
      break;
    case 'fonts':
      if (value <= 4) {
        score = 1;
      } else if (value <= 8) {
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
    case 'updated':
      if (moment(value) < moment().subtract(1, 'years')) {
        score = 4;
      } else if (moment(value) < moment().subtract(6, 'months')) {
        score = 2;
      } else {
        score = 0;
      }
      break;
    default:
      score = 2;
      break;
  }

  return score;
}
