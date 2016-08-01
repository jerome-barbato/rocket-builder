'use strict';

var gulp        = require('gulp');
var config      = require('./config');
var $           = require('gulp-load-plugins')();



/**
 * Stylesheets are preprocessed, mapped
 * and prefixed with nesting.
 */
gulp.task('compile::style', function () {

    return gulp.src(config.paths.src.sass)
        .pipe($.sourcemaps.init())
        .pipe($.cssGlobbing({extensions: ['.scss']}))
        .pipe($.sass().on('error', config.errorHandler('Sass')))
        .pipe($.pleeease({
            minifier: false,
            mqpacker: true,
            browsers: ["last 3 versions"]
        }).on('error', config.errorHandler('Pleeease')))
        .pipe($.sourcemaps.write('./', {
            includeContent: false,
            sourceRoot: '../../src/sass/'
        }))
        .pipe(gulp.dest(config.paths.dest.css))
});



/**
 * Stylesheets are minified, pre-processed, mapped
 * and prefixed.
 */
gulp.task('compress::style', function () {

    return gulp.src(config.paths.src.sass)
        .pipe($.cssGlobbing({extensions: ['.scss']}))
        .pipe($.sass().on('error', config.errorHandler('Sass')))
        .pipe($.pleeease({
            mqpacker: true,
            browsers: ["last 3 versions"]
        }).on('error', config.errorHandler('Pleeease')))
        .pipe(gulp.dest(config.paths.dest.css))
        .pipe($.size({showFiles: true}));
});