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
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'public/css/style.css': 'src/public/sass/manifest.scss'
        }
      }
    },
    babel: {
      dist: {
        options: {
          sourceMap: true,
          presets: ['es2015']
        },
        files: {
          'app/app.js': 'src/app/app.js',
          'app/controllers/site/pages.js': 'src/app/controllers/site/pages.js',
          'app/controllers/api/check.js': 'src/app/controllers/api/check.js',
          'app/config/config.js': 'src/app/config/config.js',
          'app/config/express.js': 'src/app/config/express.js',
          'app/config/setup.js': 'src/app/config/setup.js',
          'app/lib/messages.js': 'src/app/lib/messages.js',
          'app/lib/pass.js': 'src/app/lib/pass.js',
          'app/lib/score.js': 'src/app/lib/score.js',
          'app/models/result.js': 'src/app/models/result.js'
        }
      },
      prod: {
        options: {
          presets: ['es2015']
        },
        files: {
          'app/app.js': 'src/app/app.js',
          'app/controllers/site/pages.js': 'src/app/controllers/site/pages.js',
          'app/controllers/api/check.js': 'src/app/controllers/api/check.js',
          'app/config/config.js': 'src/app/config/config.js',
          'app/config/express.js': 'src/app/config/express.js',
          'app/config/setup.js': 'src/app/config/setup.js',
          'app/lib/messages.js': 'src/app/lib/messages.js',
          'app/lib/pass.js': 'src/app/lib/pass.js',
          'app/lib/score.js': 'src/app/lib/score.js',
          'app/models/result.js': 'src/app/models/result.js'
        }
      }
    },
    browserify: {
      dist: {
        options: {
          browserifyOptions: {
            debug: true
          }
        },
        files: {
          'public/js/main.js': ['src/public/js/**/*.js']
        }
      },
      prod: {
        files: {
          'public/js/main.js': ['src/public/js/**/*.js']
        }
      }
    },
    uglify: {
      dist: {
        options: {
          sourceMap: true,
          sourceMapName: 'public/js/main.js.map'
        },
        files: {
          'public/js/main.min.js': ['public/js/main.js']
        }
      },
      prod: {
        files: {
          'public/js/main.min.js': ['public/js/main.js']
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
        tasks: ['babel', 'browserify', 'develop']
      },
      uglify: {
        files: [
          'public/js/main.min-js'
        ],
        tasks: ['uglify','develop']
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
    'uglify',
    'develop',
    'watch'
  ]);

  grunt.registerTask('prod', [
    'sass',
    'babel:prod',
    'browserify:prod',
    'uglify:prod'
  ]);
};
