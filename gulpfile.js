const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const watch = require('gulp-watch');
const install = require("gulp-install");
const livereload = require('gulp-livereload');
const runElectron = require("gulp-run-electron");

const tscConfig = require('./tsconfig.json');

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

/**
 * Copies static assests to the build directory
 */
gulp.task('copy:assets', function() {
    return gulp.src([
        'src/**/*.html',
        'src/**/*.css',
        'src/**/*.js',
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
        'src/**/*.js'
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

gulp.task('watch', ['build:watch', 'run'])
gulp.task('build', ['copy:assets', 'install', 'compile']);
gulp.task('default', ['build']);
