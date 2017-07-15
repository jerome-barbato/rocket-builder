'use strict';

var gulp   = require('gulp'),
    config = require('./config'),
    $      = {
        sourcemaps : require('gulp-sourcemaps'),
        cssGlobbing: require('gulp-css-globbing'),
        sass       : require('gulp-sass'),
        pleeease   : require('gulp-pleeease'),
        size       : require('gulp-size'),
        del        : require('del')
    };


/**
 * Stylesheets are preprocessed, mapped
 * and prefixed with nesting.
 */
gulp.task('style::compile', function () {

    if (config.environment === 'development') {

        return gulp.src(config.paths.src.scss)
                   .pipe($.sourcemaps.init())
                   .pipe($.cssGlobbing({extensions: ['.scss']}))
                   .pipe($.sass().on('error', config.errorHandler('Sass')))
                   .pipe($.pleeease({minifier: false, mqpacker: true, browsers: config.builder.style.browsers }).on('error', config.errorHandler('Pleeease')))
                   .pipe($.sourcemaps.write('./', {
                       includeContent: false,
                       sourceRoot    : config.paths.css_to_sass
                   }))
                   .pipe(gulp.dest(config.paths.dest.css))
    }
    else {

        $.del.sync([config.paths.dest.css + '/*.map'], {force: true});

        return gulp.src(config.paths.src.scss)
                   .pipe($.cssGlobbing({extensions: ['.scss']}))
                   .pipe($.sass().on('error', config.errorHandler('Sass')))
                   .pipe($.pleeease({ mqpacker: true, browsers: config.builder.style.browsers}).on('error', config.errorHandler('Pleeease')))
                   .pipe(gulp.dest(config.paths.dest.css))
                   .pipe($.size({showFiles: true}));
    }
});
