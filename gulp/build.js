'use strict';

var gulp = require('gulp'),
    conf = require('./config'),
    del  = require('del');

gulp.task('clean', function () {
    return del([conf.paths.dest.js, conf.paths.dest.css], {force:true});
});