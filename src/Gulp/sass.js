'use strict';

var lazypipe    = require('lazypipe'),
	cssGlobbing = require('gulp-css-globbing'),
	sass        = require('gulp-sass'),
	pleeease    = require('gulp-pleeease');


/**
 * Global function called by bundle.js
 */
global.handleSass = lazypipe()
	.pipe(function() {
		return gif(function(file){
			return file.relative.indexOf('scss', file.relative.length - 'scss'.length) !== -1
        }, compileSass());
	});


/**
 * Stylesheets are preprocessed
 * and prefixed with nesting.
 */
var compileSass = lazypipe()
    .pipe(cssGlobbing, {extensions: ['.scss']})
    .pipe(sass)
    .pipe(pleeease, {minifier: config.environment === 'production', mqpacker: true, browsers: config.builder.style.browsers });