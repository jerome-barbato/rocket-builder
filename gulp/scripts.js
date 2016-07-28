'use strict';

var gulp        = require('gulp');
var config      = require('./config');
var $           = require('gulp-load-plugins')();



/**
 *
 */
gulp.task('concat::scripts', function(){
    config.init();
    return gulp.src(config.paths.src.js)
        .pipe($.concat('app.js'))
        .pipe($.sourcemaps.init())
        .pipe($.sourcemaps.write('./', {
            includeContent: false,
            sourceRoot: config.paths.src+'js/'
        }))
        .pipe(gulp.dest(config.paths.dest.js))
});



gulp.task('compress::scripts', function(){

    return gulp.src(config.paths.src.js)
        .pipe($.concat('app.min.js'))
        .pipe($.uglify().on('error', config.errorHandler('Scripts')))
        .pipe(gulp.dest(config.paths.dest.js))
        .pipe($.size({showFiles: true}));
});



gulp.task('compress::script::browser', function(){

    return gulp.src(config.paths.base.src+'js/core/vendors/browser.js')
        .pipe($.concat('browser.min.js'))
        .pipe($.uglify().on('error', config.errorHandler('Scripts')))
        .pipe(gulp.dest(config.paths.dest.js));
});