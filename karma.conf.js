'use strict';

var argv = require('yargs').argv;

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'karma-electron-shim.js',
      // Polyfills.
      'node_modules/core-js/client/shim.min.js',

      // System.js for module loading
      'node_modules/systemjs/dist/system.src.js',

      // Zone.js dependencies
      'node_modules/zone.js/dist/zone.js',
      'node_modules/zone.js/dist/sync-test.js',
      'node_modules/zone.js/dist/async-test.js',
      'node_modules/zone.js/dist/fake-async-test.js',
      'node_modules/zone.js/dist/proxy.js',
      'node_modules/zone.js/dist/jasmine-patch.js',

      // { pattern: 'node_modules/system-json/json.js', included: false, watched: true },      

      // RxJs.
      { pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false },
      { pattern: 'node_modules/rxjs/**/*.js.map', included: false, watched: false },
      { pattern: 'node_modules/@angular/**/*.js.map', included: false, watched: false },

      // paths loaded via module imports
      // Angular itself
      { pattern: 'node_modules/@angular/**/*.js', included: false, watched: true },

      { pattern: 'node_modules/bluebird/**/*.js', included: false, watched: true },
      { pattern: 'node_modules/knex/package.json', included: false, watched: true },
      //{ pattern: 'node_modules/knex/lib/migrate/*.js', included: false, watched: true },
      { pattern: 'node_modules/knex/**/*.js', included: false, watched: true },
      { pattern: 'node_modules/chalk/**/*.js', included: false, watched: true },
      // { pattern: 'node_modules/babel-runtime/helpers/*.js', included: false, watched: true },
      // { pattern: 'node_modules/core-js/library/fn/*.js', included: false, watched: true },
      { pattern: 'node_modules/core-js/library/**/*.js', included: false, watched: true },
      { pattern: 'node_modules/core-js/*.js', included: false, watched: true },
      { pattern: 'node_modules/babel-runtime/**/*.js', included: false, watched: true },
      { pattern: 'node_modules/create-error/create-error.js', included: false, watched: true },
      { pattern: 'node_modules/inflection/inflection.min.js', included: false, watched: true },
      { pattern: 'node_modules/inherits/inherits.js', included: false, watched: true },
      { pattern: 'node_modules/node-uuid/uuid.js', included: false, watched: true },
      { pattern: 'node_modules/pool2/**/*.js', included: false, watched: true },
      { pattern: 'node_modules/debug/debug.js', included: false, watched: true },
      { pattern: 'node_modules/pg-connection-string/index.js', included: false, watched: true },
      { pattern: 'node_modules/escape-string-regexp/index.js', included: false, watched: true },
      { pattern: 'node_modules/ansi-styles/index.js', included: false, watched: true },
      { pattern: 'node_modules/strip-ansi/index.js', included: false, watched: true },
      { pattern: 'node_modules/has-ansi/index.js', included: false, watched: true },
      { pattern: 'node_modules/supports-color/index.js', included: false, watched: true },
      { pattern: 'node_modules/ms/index.js', included: false, watched: true },
      { pattern: 'node_modules/readable-stream/**/*.js', included: false, watched: true },
      { pattern: 'node_modules/mkdirp/index.js', included: false, watched: true },
      { pattern: 'node_modules/sqlite3/lib/*.js', included: false, watched: true },
      { pattern: 'node_modules/sqlite3/sqlite3.js', included: false, watched: true },
{ pattern: 'node_modules/ansi-regex/index.js', included: false, watched: true },{ pattern: 'node_modules/double-ended-queue/js/deque.js', included: false, watched: true },      
{ pattern: 'node_modules/hashmap/hashmap.js', included: false, watched: true },      
{ pattern: 'node_modules/simple-backoff/simple-backoff.js', included: false, watched: true },      
{ pattern: 'node_modules/isarray/index.js', included: false, watched: true },
{ pattern: 'node_modules/core-util-is/lib/util.js', included: false, watched: true },
{ pattern: 'node_modules/string_decoder/index.js', included: false, watched: true },
{ pattern: 'node_modules/nopt/lib/nopt.js', included: false, watched: true },      
{ pattern: 'node_modules/npmlog/log.js', included: false, watched: true },      
{ pattern: 'node_modules/abbrev/abbrev.js', included: false, watched: true },     
{ pattern: 'node_modules/are-we-there-yet/*.js', included: false, watched: true },      
{ pattern: 'node_modules/gauge/*.js', included: false, watched: true },      
{ pattern: 'node_modules/set-blocking/index.js', included: false, watched: true },      
{ pattern: 'node_modules/console-control-strings/index.js', included: false, watched: true },      
{ pattern: 'node_modules/tar-pack/index.js', included: false, watched: true },      
{ pattern: 'node_modules/has-unicode/index.js', included: false, watched: true },      
{ pattern: 'node_modules/semver/semver.js', included: false, watched: true },     
{ pattern: 'node_modules/signal-exit/*.js', included: false, watched: true },      
{ pattern: 'node_modules/rimraf/*.js', included: false, watched: true },      
{ pattern: 'node_modules/tar/tar.js', included: false, watched: true },      
{ pattern: 'node_modules/tar/lib/*.js', included: false, watched: true },      
{ pattern: 'node_modules/once/once.js', included: false, watched: true },      
{ pattern: 'node_modules/fstream/fstream.js', included: false, watched: true }, { pattern: 'node_modules/fstream/lib/*.js', included: false, watched: true },      
{ pattern: 'node_modules/fstream-ignore/ignore.js', included: false, watched: true },      
//{ pattern: 'node_modules//index.js', included: false, watched: true },      
//{ pattern: 'node_modules//index.js', included: false, watched: true },      
{ pattern: 'node_modules/node-pre-gyp/lib/util/*.json', included: false, watched: true },      
{ pattern: 'node_modules/node-pre-gyp/lib/**/*.js', included: false, watched: true },      
//{ pattern: 'node_modules//index.js', included: false, watched: true },      
      { pattern: 'node_modules/bookshelf/package.json', included: false, watched: true },
      { pattern: 'node_modules/bookshelf/**/*.js', included: false, watched: true },
      { pattern: 'node_modules/lodash/**/*.js', included: false, watched: false },

      { pattern: 'build/**/*.js', included: false, watched: true },
      { pattern: 'build/**/*.html', included: false, watched: true, served: true },
      { pattern: 'build/**/*.css', included: false, watched: true, served: true },
      { pattern: 'node_modules/systemjs/dist/system-polyfills.js', included: false, watched: false }, // PhantomJS2 (and possibly others) might require it

      'test-main.js'
    ],

    // list of files to exclude
    exclude: [
      'node_modules/**/*-stub.js',
      'node_modules/**/*spec.js'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      'Electron'
    ],

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Passing command line arguments to tests
    client: {
      files: argv.files
    }
  });

  if (process.env.TRAVIS || process.env.CIRCLECI) {
    config.browsers = ['Chrome_travis_ci'];
    config.singleRun = true;
  }
};
