import express from 'express';
import config from './config/config';
import expressConfig from './config/express';

var app = express();
var expressWs = require('express-ws')(app);

expressConfig(app, config);

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

