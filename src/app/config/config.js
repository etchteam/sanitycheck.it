import path from 'path';

const rootPath = path.normalize(`${__dirname}/../..`);
const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 3000;

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'sanitycheck-it'
    },
    port
  },

  test: {
    root: rootPath,
    app: {
      name: 'sanitycheck-it'
    },
    port
  },

  production: {
    root: rootPath,
    app: {
      name: 'sanitycheck-it'
    },
    port
  }
};

module.exports = config[env];
