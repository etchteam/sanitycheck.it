import extend from 'object-extend';
import message from '../lib/messages';
import score from '../lib/score';
import pass from '../lib/pass';

var options = {};

export default function(opt) {
  options = extend({
    name: '',
    pass: false,
    value: 0,
    message: '',
    score: 0
  }, opt || {});

  options.score = score(options.name, options.value);
  options.message = message(options.name, options.score);
  options.pass = pass(options.name, options.value);

  return options;
};
