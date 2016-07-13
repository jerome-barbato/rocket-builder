'use strict';

var gulp = require('gulp');
var conf = require('./config');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'del']
});

gulp.task('clean', function () {
    return $.del([conf.paths.dest.js, conf.paths.dest.css], {force:true});
});