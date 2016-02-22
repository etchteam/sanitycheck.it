import express from 'express';
import config from './config/config';
import expressConfig from './config/express';
import setup from './config/setup';
import http from 'http';
import socketio from 'socket.io';

const app = express();

expressConfig(app, config);

const server = http.Server(app);
const io = socketio.listen(server);

setup(app, io);

server.listen(config.port);
