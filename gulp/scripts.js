'use strict';

var gulp        = require('gulp'),
    config      = require('./config'),
    eslint      = require('gulp-eslint'),
    $           = {
        concat      : require('gulp-concat'),
        sourcemaps  : require('gulp-sourcemaps'),
        uglify      : require('gulp-uglify'),
        size        : require('gulp-size')
    };


gulp.task('lint::scripts', function() {
        // ESLint ignores files with "node_modules" paths.
        // So, it's best to have gulp ignore the directory as well.
        // Also, Be sure to return the stream from the task;
        // Otherwise, the task may end before the stream has finished.
        return gulp.src(config.paths.src.js)
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
            .pipe(eslint())
            // eslint.format() outputs the lint results to the console.
            // Alternatively use eslint.formatEach() (see Docs).
            .pipe(eslint.format())
            // To have the process exit with an error code (1) on
            // lint error, return the stream and pipe to failAfterError last.
            .pipe(eslint.failAfterError());
});


/**
 *
 */
gulp.task('concat::scripts', function(){

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

    return gulp.src([config.paths.base.src+'js/core/vendors/modernizr.min.js', config.paths.base.src+'js/core/vendors/browser.js'])
        .pipe($.concat('browser.min.js'))
        .pipe($.uglify().on('error', config.errorHandler('Scripts')))
        .pipe(gulp.dest(config.paths.dest.js));
});