'use strict';

var request = require('request');

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var reloadPort = 35729, files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'app/app.js'
      }
    },
    sass: {
      dist: {
        files: {
          'public/css/style.css': 'src/public/sass/manifest.scss'
        }
      }
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015']
      },
      dist: {
        files: {
          'app/app.js': 'src/app/app.js',
          'app/controllers/site/pages.js': 'src/app/controllers/site/pages.js',
          'app/controllers/api/check.js': 'src/app/controllers/api/check.js',
          'app/config/config.js': 'src/app/config/config.js',
          'app/config/express.js': 'src/app/config/express.js',
          'app/lib/messages.js': 'src/app/lib/messages.js',
          'app/lib/pass.js': 'src/app/lib/pass.js',
          'app/lib/score.js': 'src/app/lib/score.js',
          'app/models/result.js': 'src/app/models/result.js'
        }
      }
    },
    browserify: {
      options: {
        browserifyOptions: {
          debug: true
        }
      },
      dist: {
        files: {
          'public/js/main.js': ['src/public/js/**/*.js']
        }
      }
    },
    watch: {
      options: {
        nospawn: true,
        livereload: reloadPort
      },
      js: {
        files: [
          'src/**/*.js'
        ],
        tasks: ['babel', 'browserify','develop']
      },
      css: {
        files: [
          'src/public/sass/*.scss'
        ],
        tasks: ['sass'],
        options: {
          livereload: reloadPort
        }
      },
      views: {
        files: [
          'app/views/*.jade',
          'app/views/**/*.jade'
        ],
        options: { livereload: reloadPort }
      }
    }
  });

  grunt.config.requires('watch.js.files');
  files = grunt.config('watch.js.files');
  files = grunt.file.expand(files);

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    var done = this.async();
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function(err, res) {
          var reloaded = !err && res.statusCode === 200;
          if (reloaded)
            grunt.log.ok('Delayed live reload successful.');
          else
            grunt.log.error('Unable to make a delayed live reload.');
          done(reloaded);
        });
    }, 500);
  });

  grunt.registerTask('default', [
    'sass',
    'babel',
    'browserify',
    'develop',
    'watch'
  ]);
};
