const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const tscConfig = require('./tsconfig.json');

gulp.task('clean', function() {
    return del('build/**/*');
});

gulp.task('compile', function() {
    return gulp
        .src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build'));
});

gulp.task('copy:render', function() {
    return gulp.src([
        'src/**/*.html',
        'src/**/systemjs.config.js'
    ])
    .pipe(gulp.dest('build/'));
})
gulp.task('copy:main', function() {
    return gulp.src([
        'package.json',
        'src/systemjs.config.js',
        'src/main.js',
    ])
    .pipe(gulp.dest('build/'));
})

gulp.task('copy:assets', ['copy:render', 'copy:main']);

gulp.task('build', ['copy:assets', 'compile']);
gulp.task('default', ['build']);
