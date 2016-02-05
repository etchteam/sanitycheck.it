import express from 'express';
import extend from 'object-extend';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compress from 'compression';
import methodOverride from 'method-override';

module.exports = (app, config) => {
  const env = process.env.NODE_ENV || 'development';
  app.locals = extend({
    ENV: env,
    ENV_DEVELOPMENT: env === 'development'
  }, app.locals);

  app.set('views', `${config.root}/app/views`);
  app.set('view engine', 'jade');

  app.use(favicon(`${config.root}/public/img/icons/favicon.ico`));

  app.use(logger('dev'));

  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(cookieParser());

  app.use(compress());

  app.use(express.static(`${config.root}/public`, {
    maxAge: '1 year',
    setHeaders(res) {
      const date = new Date();
      date.setYear(date.getFullYear() + 1);
      res.set('expires', date.toUTCString());
    }
  }));

  app.use(methodOverride());
};
