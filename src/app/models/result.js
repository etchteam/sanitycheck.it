import extend from 'object-extend';
import message from '../lib/messages';
import score from '../lib/score';
import pass from '../lib/pass';

let options = {};

export default function (opt = {}) {
  options = extend({
    prettyName: '',
    name: '',
    pass: false,
    value: 0,
    message: '',
    score: 0
  }, opt);

  options.score = score(options.name, options.value);
  options.message = message(options.name, options.score);
  options.pass = pass(options.name, options.value);

  if (options.prettyName === '') {
    options.prettyName = options.name;
  }

  return options;
}
