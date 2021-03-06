const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const watch = require('gulp-watch');
const install = require("gulp-install");
const livereload = require('gulp-livereload');
const runElectron = require("gulp-run-electron");
const rebuildElectron = require('electron-rebuild');
const electron = require("electron");
const jasmine = require('gulp-jasmine');
const reporters = require('jasmine-reporters');
const tscConfig = require('./tsconfig.json');
const exit = require('gulp-exit');
const runSequence = require('run-sequence');
const childProcess = require('child_process');
const path = require('path')
const process = require('process')

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
                return rebuildElectron.installNodeHeaders('1.4.1').then(function() {
                    return rebuildElectron.rebuildNativeModules('1.4.1', './build/node_modules');                
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
        .pipe(runElectron(['--debug']));
})

gulp.task('unittest:services', () => {
    process.argv.push('--database=test-unit.database')
    return gulp.src([
        'build/test/init.js',
        'build/test/services/**/*.js',
        'build/test/util/**/*.js'])
        .pipe(jasmine({
            reporter: new reporters.TerminalReporter()
        }
        )).pipe(exit())
});

gulp.task('end2end:all', () => {
    return gulp.src([
        'build/test/init.js',
        'build/test/end2end/**/*.js'])
        .pipe(jasmine({
            reporter: new reporters.TerminalReporter()
        }
        )).pipe(exit())
});

gulp.task('test:all', () => {
    return gulp.src([
        'build/test/init.js',
        'build/test/**/*.js'])
        .pipe(jasmine({
            reporter: new reporters.TerminalReporter()
        }
        )).pipe(exit())
});

/**
 * Build the binary modules required for running the unit tests.
 */
gulp.task('rebuild:test-modules', ['install'], (done) => {
    return childProcess.exec(path.join('node_modules', '.bin', 'node-pre-gyp')
        + ' --fallback-to-build install',
        { cwd: './node_modules/sqlite3' }, (err, stdout, stderr) => {
        done(err);
    });
});

/**
 * Copy the built test binary modules to the build folder.
 */
gulp.task('copy:test-modules', ['rebuild:test-modules'], () => {
    return gulp.src([
        'node_modules/sqlite3/lib/binding/node-*/node_sqlite3.node'
    ])
    .pipe(gulp.dest('build/node_modules/sqlite3/lib/binding/'));
})

gulp.task('watch', ['build:watch', 'run'])
gulp.task('build', ['copy:assets', 'install', 'rebuild', 'compile']);
gulp.task('unittest', () => {
    runSequence('build', ['copy:test-modules'], 'unittest:services')
})
gulp.task('unittester', ['unittest:services']);
gulp.task('end2end', () => {
    runSequence('build', 'end2end:all')
})
gulp.task('end2ender', ['end2end:all']);
gulp.task('test', () => {
    runSequence('build', 'test:all')
})
gulp.task('default', ['build']);
