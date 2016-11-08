'use strict';

var gulp   = require('gulp'),
    config = require('./config'),
    del    = require('del');

gulp.task('clean', function () {
    return del([config.paths.dest.js, config.paths.dest.css], {force:true});
});