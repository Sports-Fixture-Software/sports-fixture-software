'use strict';

module.exports = function (config) {
    config.set({
        plugins: [
            {
                'preprocessor:karma-electron-preprocessor':
                ['factory',
                    require('./config/test/karma-electron-preprocessor.js')]
            },
            'karma-jasmine',
            'karma-electron-launcher',
        ],

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: './',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        preprocessors: {
            'build/app/util/*.js': ['karma-electron-preprocessor'],
            'build/test/util/*.js': ['karma-electron-preprocessor'],
        },

        // list of files / patterns to load in the browser
        files: [
            'config/test/karma.shim.js',
            'build/app/util/*.js',
            'build/test/util/*.js',
            'config/test/karma-electron-bridge.js',
        ],

        // list of files to exclude
        exclude: [
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
        logLevel: config.LOG_DEBUG,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            'Electron'
        ],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,
    });
};
