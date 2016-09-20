const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const watch = require('gulp-watch');
const install = require("gulp-install");
const livereload = require('gulp-livereload');
const runElectron = require("gulp-run-electron");
const rebuildElectron = require('electron-rebuild');
const electron = require("electron-prebuilt");
const jasmine = require('gulp-jasmine');
const reporters = require('jasmine-reporters');
const tscConfig = require('./tsconfig.json');
const exit = require('gulp-exit');
const runSequence = require('run-sequence');

/**
 * Removes all build artifacts
 */
gulp.task('clean', function() {
    return del('build/**/*');
});

/**
 * Compiles typescript to javascript
 * 
 * Sourcemaps are included in the compiled files.
 */
gulp.task('compile', function() {
    return gulp
        .src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build'))
        .pipe(livereload());
});

gulp.task('rebuild', ['install'], function() {
    return rebuildElectron.shouldRebuildNativeModules(electron)
            .then(function(needsBuild) {
                if (!needsBuild) {
                    console.log("No build required");
                    return true;
                }                
                return rebuildElectron.installNodeHeaders('1.3.1').then(function() {
                    return rebuildElectron.rebuildNativeModules('1.3.1', './build/node_modules');                
                });
            })
});

/**
 * Copies static assests to the build directory
 */
gulp.task('copy:assets', function() {
    return gulp.src([
        'src/**/*.html',
        'src/**/*.css',
        'src/**/*.js',
        'src/**/*.png'
    ])
    .pipe(gulp.dest('build/'))
    .pipe(livereload());
})

/**
 * Installs node modues to the build directory
 * 
 * The root package.json is coppied to the build
 * directory prior to installation.
 */
gulp.task('install', function() {
    return gulp.src([
        'package.json'
    ])
    .pipe(gulp.dest('build/'))
    .pipe(install({ignoreScripts: true, production: true}))
    .pipe(livereload());
})

/**
 * Watches for changes and rebuilds as needed
 * 
 * The minimum possible number of files will be rebuilt.
 * Also starts livereload to refresh the browser when files
 * change.
 */
gulp.task('build:watch', ['build'], function() {
    gulp.watch([
        'src/**/*.html',
        'src/**/*.css',
        'src/**/*.js',
        'src/**/*.png'
    ], ['copy:assets']);

    gulp.watch([
        'src/**/*.ts'
    ], ['compile']);

    gulp.watch([
        'package.json'
    ], ['install'])
    gulp.watch([
        'tsconfig.json',
        'typings.json'
    ], ['build']);

    livereload.listen();
})

/**
 * Builds and runs the application
 */
gulp.task('run', ['build'], function() {
    return gulp.src('build')
        .pipe(runElectron());
})

gulp.task('unittest:services', () => {
    return gulp.src([
        'build/test/init.js',
        'build/test/services/**/*.js',
        'build/test/util/**/*.js'])
        .pipe(jasmine({
            reporter: new reporters.TerminalReporter()
        }
        )).pipe(exit())
});

gulp.task('watch', ['build:watch', 'run'])
gulp.task('build', ['copy:assets', 'install', 'rebuild', 'compile']);
gulp.task('unittest', () => {
    runSequence('build', 'unittest:services')
})
gulp.task('unittester', ['unittest:services']);
gulp.task('test', ['unittest']);
gulp.task('tester', ['unittester']);
gulp.task('default', ['build']);
