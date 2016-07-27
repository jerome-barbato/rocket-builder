
/**
 * Configuration
 */

// Dependencies
var gutil       = require('gulp-util');
var fs          = require('fs');

// Retrieving environment from environment variable
var environment = (process.env.WWW_ENV ? process.env.WWW_ENV : "development");

// Enable watching for changes in src files
var watching_mode   = true;

// Framework parameter can be rocket, wordpress or silex
var framework       = "rocket";

// Theme name will help to find src for compilation
var theme_name      = "meta";

// Application root path
var app_path    = "../app/";

// Src assets paths
var src_path;

// Public assets paths
var public_path;

// Global config file
var paths;


/** Load function will set configuration variables */
exports.load  = function load() {

    // Application root path differ for each framework
    switch (framework) {
        case "silex":
            app_path    = "../app/";
            break;
        case "wordpress":
            app_path    = "../../../web/app/themes/" + theme_name + "/app/";
            break;
        default:
            app_path    = "../app/";
    }

    src_path    = app_path+"resources/src/";
    public_path = app_path+"resources/public/";
    paths = {
        base : {
            config   : app_path+'config/front.config',
            src      : src_path,
            public   : public_path
        },
        src : {
            js       : [],
            sass     : src_path+"sass/*.scss",
            template : src_path+"template/**/*.twig",
            html     : public_path+"views/**/*.html"
        },
        dest : {
            js       : public_path+"js",
            css      : public_path+"css",
            template : app_path+"views"
        },
        watch : {
            js       : src_path+"js/**/*.js",
            sass     : src_path+"sass/**/*.scss",
            template : src_path+"template/**/*.twig"
        }
    };
};


/**
 * Rocket front configuration added some paths to configuration file
 * we add them by merging two objects
 * @TODO: Optimize
 */
function addCoreDependencies() {

    var front_config = JSON.parse(fs.readFileSync(paths.base.config));
    var needed_core  = front_config.app;

    // Define js src order from front config
    needed_core.vendors.forEach(function(library){

        paths.src.js.push(src_path+'js/core/vendors/'+library+'.min.js');

        if( library == "angular" || library == "jquery" )
            paths.src.js.push(src_path+'js/core/vendors/'+library+'/**/*.js');
    });

    needed_core.polyfill.forEach(function(library){

        paths.src.js.push(src_path+'js/core/polyfill/'+library+'.js');
    });

    needed_core.libraries.forEach(function(library){

        paths.src.js.push(src_path+'js/core/libraries/'+library+'.js');
    });

    paths.src.js.push(src_path+'js/app.js');
    paths.src.js.push(src_path+'js/app/**/*.js');
    paths.src.js.push(src_path+'js/vendors/**/*.js');
}

/** Auto start */
exports.load();
addCoreDependencies();


/** Exports */
exports.paths = paths;
exports.environment = environment;
exports.watching_mode = watching_mode;
exports.framework = framework;



/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function(title) {
    'use strict';

    return function(err) {
        gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
        this.emit('end');
    };
};



/**
 * Karma Configuration File
exports.karma =
module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '..',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'js/app/**.js'
        ],

        // list of files to exclude
        exclude: [

        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {

        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['spec'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            'PhantomJS'
            // , 'Chrome'
            // , 'Firefox'
            // , 'Safari'
        ],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
}; */