import glob from 'glob';
import config from './config';

let development = true;

function notFoundError(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
}

function brokenError(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: development ? err : {},
    title: 'error'
  });
}

export default function (app, io) {
  const controllers = glob.sync(`${config.root}/app/controllers/**/*.js`);
  development = app.get('env') === 'development';

  controllers.forEach((controller) => {
    require(controller)(app, io);
  });

  app.use(notFoundError);

  app.use(brokenError);
}
