import express from 'express';
import config from './config/config';
import expressConfig from './config/express';
import setup from './config/setup';
import http from 'http';
import socketio from 'socket.io';

var app = express();

expressConfig(app, config);

var server = http.Server(app);
var io = socketio.listen(server);

setup(app, io);

server.listen(config.port);
