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

// Load our SystemJS configuration.
System.config({
  baseURL: '/base/'
});

System.config({
  defaultJSExtensions: true,
  paths: {
    'lodash': 'node_modules/lodash/index.js',
  },
  map: {
    'rxjs': 'node_modules/rxjs',
    '@angular': 'node_modules/@angular',
    'bluebird': 'node_modules/bluebird',
    'knex': 'node_modules/knex',
    // not working
    'knex/lib/migrate': 'node_modules/knex/lib/migrate',
    'chalk': 'node_modules/chalk',
    'babel-runtime': 'node_modules/babel-runtime',
    'create-error': 'node_modules/create-error',
    'inflection': 'node_modules/inflection',
    'inherits': 'node_modules/inherits',
    'node-uuid': 'node_modules/node-uuid',
    'pool2': 'node_modules/pool2',
    'debug': 'node_modules/debug',
    'bookshelf': 'node_modules/bookshelf',
    'events': '@node/events'
  },
  packageConfigPaths: [
    'node_modules/knex/package.json',
    'node_modules/bookshelf/package.json',
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
      defaultExtension: 'js'
    },
    'knex/lib/migrate': {
      main: 'index.js',
      defaultExtension: 'js'
    },
    'chalk': {
      main: 'index.js',
      defaultExtension: 'js'
    },
    'babel-runtime': {
      main: 'core-js.js',
      defaultExtension: 'js'
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
    'bookshelf': {
      main: 'bookshelf.js',
      defaultExtension: 'js'
    },
  }
});

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
