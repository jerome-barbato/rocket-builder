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

    for (var i in config.paths.src.js) {
        var path = config.paths.src.js[i];
        if (path.indexOf("vendors") === -1) {
            sources_path.push(path);
        }
    }

    return gulp.src(sources_path)
            .pipe(eslint(
                {
                    "env": {
                        "node": true,
                        "browser": true
                    },
                    "rules": {
                        "array-bracket-spacing": [2, "never"],
                        "block-scoped-var": 2,
                        "brace-style": [2, "1tbs"],
                        "camelcase": 1,
                        "computed-property-spacing": [2, "never"],
                        "curly": 0,
                        "eol-last": 2,
                        "eqeqeq": [2, "smart"],
                        "max-depth": [1, 3],
                        'max-len': [1, 80, 4, {
                            ignoreComments: true,
                            ignoreUrls: true
                        }],
                        "max-statements": [1, 30],
                        "new-cap": 1,
                        "no-extend-native": 2,
                        "no-mixed-spaces-and-tabs": 2,
                        "no-trailing-spaces": 2,
                        'no-unused-vars': [2, {
                            "args": "none",
                        }],
                        "no-use-before-define": [2, "nofunc"],
                        "object-curly-spacing": [2, "always"],
                        "quotes": [2, "single", "avoid-escape"],
                        "semi": [2, "always"],
                        "keyword-spacing": [2, { "before": true }],
                        "space-unary-ops": 2,
                        'indent': [2, 4, {
                            SwitchCase: 1
                        }],
                        'space-before-function-paren': [2, 'never'],
                        'valid-jsdoc': [2, {
                            requireReturn: false,
                            prefer: {
                                returns: 'return'
                            }
                        }],
                        'require-jsdoc': 1,
                        'no-floating-decimal': 0
                    }
                }
            ))
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