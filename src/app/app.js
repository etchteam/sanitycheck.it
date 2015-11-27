import express from 'express';
import config from './config/config';
import expressConfig from './config/express';

var app = express();

expressConfig(app, config);

app.listen(process.env.PORT || config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

