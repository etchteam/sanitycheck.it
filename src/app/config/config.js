import path from 'path';
var    rootPath = path.normalize(__dirname + '/../..');
var    env = process.env.NODE_ENV || 'development';
var    port = process.env.PORT || 3000;

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'sanitycheck-it'
    },
    port: port
  },

  test: {
    root: rootPath,
    app: {
      name: 'sanitycheck-it'
    },
    port: port
  },

  production: {
    root: rootPath,
    app: {
      name: 'sanitycheck-it'
    },
    port: port
  }
};

module.exports = config[env];
