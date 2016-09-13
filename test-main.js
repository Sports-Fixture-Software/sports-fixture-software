if (!Object.hasOwnProperty('name')) {
  Object.defineProperty(Function.prototype, 'name', {
    get: function() {
      var matches = this.toString().match(/^\s*function\s*(\S*)\s*\(/);
      var name = matches && matches.length > 1 ? matches[1] : "";
      Object.defineProperty(this, 'name', {value: name});
      return name;
    }
  });
}

// Turn on full stack traces in errors to help debugging
Error.stackTraceLimit = Infinity;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

// Cancel Karma's synchronous start,
// we will call `__karma__.start()` later, once all the specs are loaded.
__karma__.loaded = function() {};
/*
// Load our SystemJS configuration.
System.config({
  baseURL: '/base/node_modules'
});

System.config({
  defaultJSExtensions: true,
  paths: {
    'lodash': 'lodash/index.js',//'node_modules/',
    // 'knex/lib/migrate.js': 'knex/lib/migrate/index.js',
    // 'knex/lib/migrate': 'knex/lib/migrate/index.js',
    // '../migrate.js': 'knex/lib/migrate/index.js',
    // '../migrate': 'knex/lib/migrate/index.js',
  },
  map: {
    'build': '../base/build',
    // the following shouldn't be needed. Should be resolved via the package below, but failing. Systemjs bug?
    // 'knex/lib/migrate': 'knex/lib/migrate/index.js',
    // 'knex/lib/migrate.js': 'knex/lib/migrate/index.js',
    // '../migrate': 'knex/lib/migrate/index.js',
    // '../migrate.js': 'knex/lib/migrate/index.js',
    // 'knex/lib/seed': 'knex/lib/seed/index.js',
    //'knex/lib/migrate': 'knex/lib/migrate/index.js',
//     'rxjs': 'node_modules/rxjs',
//     '@angular': 'node_modules/@angular',
//     'bluebird': 'node_modules/bluebird',
//     'knex': 'node_modules/knex',
//     // not working
// //    'knex/lib/migrate': 'knex/lib/migrate',
//     'chalk': 'node_modules/chalk',
//     'babel-runtime': 'node_modules/babel-runtime',
//     'create-error': 'node_modules/create-error',
//     'inflection': 'node_modules/inflection',
//     'inherits': 'node_modules/inherits',
//     'node-uuid': 'node_modules/node-uuid',
//     'pool2': 'node_modules/pool2',
//     'debug': 'node_modules/debug',
//     'bookshelf': 'node_modules/bookshelf',
    'assert': '@node/assert',
    'buffer': '@node/buffer',
    'events': '@node/events',
    'fs': '@node/fs',
    'path': '@node/path',
    'stream': '@node/stream',
    'url': '@node/url',
    'util': '@node/util',
    'zlib': '@node/util'
  },
  packageConfigPaths: [
    'knex/package.json',//'node_modules',
    'bookshelf/package.json',//'node_modules',
    'bookshelf/package.json',//'node_modules',
    //'node-pre-gyp/package.json',
  ],
  packages: {
    '@angular/common': {
      main: 'index.js',
      defaultExtension: 'js'
    },
    '@angular/compiler': {
      main: 'index.js',
      defaultExtension: 'js'
    },
    '@angular/core': {
      main: 'index.js',
      defaultExtension: 'js'
    },
    '@angular/forms': {
      main: 'index.js',
      defaultExtension: 'js'
    },
    '@angular/http': {
      main: 'index.js',
      defaultExtension: 'js'
    },
    '@angular/platform-browser': {
      main: 'index.js',
      defaultExtension: 'js'
    },
    '@angular/platform-browser-dynamic': {
      main: 'index.js',
      defaultExtension: 'js'
    },
    '@angular/router': {
      main: 'index.js',
      defaultExtension: 'js'
    },
    'rxjs': {
      defaultExtension: 'js'
    },
    'bluebird': {
      main: 'js/release/bluebird.js',
      defaultExtension: 'js'
    },
    'knex': {
      main: 'knex.js',
      map: {
        '../migrate': 'knex/lib/migrate/index.js',
        '../seed': 'knex/lib/seed/index.js',
        '../sqlite3': 'knex/lib/dialects/sqlite3/index.js'        
      }
      // paths: {
      //   '../migrate.js': 'knex/lib/migrate/index.js',
      //   'knex/lib/migrate.js': 'knex/lib/migrate/index.js'
      // },
      //defaultExtension: 'js'
    },
    // 'knex/lib/migrate': {
    //   main: 'index.js'
    // },
    // 'knex/lib/seed': {
    //   main: 'index.js',
    //   defaultExtension: 'js'
    // },
    'chalk': {
      main: 'index.js',
      defaultExtension: 'js'
    },
    'core-js': {
      main: 'index.js',
      defaultExtension: 'js',
    },
    'babel-runtime': {
      main: 'core-js.js',
      defaultExtension: 'js', // needed
      map: {
        'core-js/library/fn/symbol': 'core-js/library/fn/symbol/index.js'
      }
      // map: {
      //   'core-js/library/fn/object/define-property': 
      // }
    },
    'create-error': {
      main: 'create-error.js',
      defaultExtension: 'js'
    },
    'inflection': {
      main: 'inflection.min.js',
      defaultExtension: 'js'
    },
    'inherits': {
      main: 'inherits.js',
      defaultExtension: 'js'
    },
    'node-uuid': {
      main: 'uuid.js',
      defaultExtension: 'js'
    },
    'pool2': {
      main: 'index.js',
      defaultExtension: 'js'
    },
    'debug': {
      main: 'debug.js',
      defaultExtension: 'js'
    },
    'pg-connection-string': {
      main: 'index.js',
      defaultExtension: 'js'
    },
    'escape-string-regexp': {
      main: 'index.js',
      defaultExtension: 'js'
    },
    'ansi-styles': {
      main: 'index.js',
      defaultExtension: 'js'
    },
    'strip-ansi': {
      main: 'index.js',
      defaultExtension: 'js'
    },
    'has-ansi': {
      main: 'index.js',
      defaultExtension: 'js'
    },
    'supports-color': {
      main: 'index.js',
      defaultExtension: 'js'
    },
    'ms': {
      main: 'index.js',
      defaultExtension: 'js'
    },
    'readable-stream': {
      main: 'readable.js',
      defaultExtension: 'js'
    },
    'mkdirp': {
      main: 'index.js',
    },
    'sqlite3': {
      main: 'sqlite3.js',
    },
    'ansi-regex': {
      main: 'index.js',
    },
    'double-ended-queue': {
      main: 'js/deque.js',
    },
    'hashmap': {
      main: 'hashmap.js',
    },
    'simple-backoff': {
      main: 'simple-backoff.js',
    },
    'isarray': {
      main: 'index.js',
    },
    'core-util-is': {
      main: 'lib/util.js',
    },
    'string_decoder': {
      main: 'index.js',
    },
    'nopt': {
         main: 'lib/nopt.js',
    },
    'npmlog': {
         main: 'log.js',
    },
    'abbrev': {
         main: 'abbrev.js',
    },
    'are-we-there-yet': {
         main: 'index.js',
    },
    'gauge': {
         main: 'index.js',
    },
    'set-blocking': {
         main: 'index.js',
    },
    'console-control-strings': {
         main: 'index.js',
    },
    'tar-pack': {
         main: 'index.js',
    },
    'has-unicode': {
         main: 'index.js',
    },
    'semver': {
         main: 'semver.js',
    },
    'signal-exit': {
         main: 'index.js',
    },
    'rimraf': {
         main: 'rimraf.js',
    },
    'tar': {
         main: 'tar.js',
    },
    'once': {
         main: 'once.js',
    },
    'fstream': {
         main: 'fstream.js',
    },
    'fstream-ignore': {
         main: 'ignore.js',
    },
    // '': {
    //      main: 'index.js',
    // },
    // '': {
    //      main: 'index.js',
    // },
    'node-pre-gyp': {
      main: 'lib/node-pre-gyp.js',
      map: {
        '../package': 'node-pre-gyp/lib/package.js'
        //'../package': 'node-pre-gyp/lib/package.js'
      },
    },
    // '': {
    //      main: 'index.js',
    // },
    
//    has-ansi
    'bookshelf': {
      main: 'bookshelf.js',
      defaultExtension: 'js'
    },
  }
});
*/
// System.import('system-json/json.js').then(function(main) {
//   return
Promise.all([
    System.import('@angular/core/testing'),
    System.import('@angular/platform-browser-dynamic/testing')
]).then(function (providers) {
  var testing = providers[0];
  var testingBrowser = providers[1];

  testing.setBaseTestProviders(testingBrowser.TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
    testingBrowser.TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS);

}).then(function() {
  return Promise.all(
    Object.keys(window.__karma__.files) // All files served by Karma.
    .filter(onlySpecFiles)
    .map(file2moduleName)
    .map(function(path) {
      return System.import(path).then(function(module) {
        if (module.hasOwnProperty('main')) {
          module.main();
        } else {
          throw new Error('Module ' + path + ' does not implement main() method.');
        }
      });
    }));
})
.then(function() {
  __karma__.start();
}, function(error) {
  console.error(error.stack || error);
  __karma__.start();
});

function onlySpecFiles(path) {
  // check for individual files, if not given, always matches to all
  var patternMatched = __karma__.config.files ?
    path.match(new RegExp(__karma__.config.files)) : true;

  return patternMatched && /[\.|_]spec\.js$/.test(path);
}

// Normalize paths to module names.
function file2moduleName(filePath) {
  return filePath.replace(/\\/g, '/')
    .replace(/^\/base\//, '')
    .replace(/\.js$/, '');
}
