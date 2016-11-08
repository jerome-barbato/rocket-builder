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

    var sources_path = [];

    for (var i in config.paths.src.js.all) {
        var path = config.paths.src.js.all[i];
        if (path.indexOf("vendor") === -1) {
            sources_path.push(path);
        }
    }

    return gulp.src(sources_path)
            .pipe(eslint({ configFile: 'gulp/config/eslintrc.json'}))
            .pipe(eslint.format())
            .pipe(eslint.failAfterError());

});


/**
 *
 */
gulp.task('concat::scripts', function(){

    return gulp.src(config.paths.src.js.app)
        .pipe($.concat('app.js'))
        .pipe($.sourcemaps.init())
        .pipe($.sourcemaps.write('./', {
            includeContent: false,
            sourceRoot: config.paths.src+'js/'
        }))
        .pipe(gulp.dest(config.paths.dest.js))
});



gulp.task('compress::scripts', function(){

    return gulp.src(config.paths.src.js.app)
        .pipe($.concat('app.js'))
        .pipe($.uglify().on('error', config.errorHandler('Scripts')))
        .pipe(gulp.dest(config.paths.dest.js))
        .pipe($.size({showFiles: true}));
});



gulp.task('compress::script::browser', function(){

    return gulp.src([config.paths.asset+'/js/vendor/modernizr.js', config.paths.asset+'/js/vendor/browser.js'])
        .pipe($.concat('browser.min.js'))
        .pipe($.uglify().on('error', config.errorHandler('Scripts')))
        .pipe(gulp.dest(config.paths.dest.js));
});