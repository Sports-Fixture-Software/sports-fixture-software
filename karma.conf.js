// Karma configuration
// Generated on Wed Sep 07 2016 20:46:18 GMT+0930 (Cen. Australia Standard Time)

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'src/*.js',
      'test/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/*.ts': ['typescript', 'sourcemap']   // Use karma-sourcemap-loader
    },


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
    browsers: ['Chrome', 'Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    typescriptPreprocessor: {
      // options passed to typescript compiler
      tsconfigPath: './tsconfig.json', // *obligatory
      compilerOptions: { // *optional
        removeComments: false
      },
      // Options passed to gulp-sourcemaps to create sourcemaps
      sourcemapOptions: { includeContent: true, sourceRoot: '/src' },
      // ignore all files that ends with .d.ts (this files will not be served)
      ignorePath: function (path) {
        return /\.d\.ts$/.test(path);
      },
      // transforming the filenames
      // you can pass more than one, they will be execute in order
      transformPath: [function (path) { // *optional
        return path.replace(/\.ts$/, '.js');
      }, function (path) {
        return path.replace(/[\/\\]test[\/\\]/i, '/'); // remove directory test and change to /
      }]
    }
  })
}
