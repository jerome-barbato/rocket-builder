
/**
 * configuration
 */

// Dependencies
var gutil   = require('gulp-util'),
    fs      = require('fs'),
    gulp    = require('gulp'),
    yaml    = require('js-yaml');

var getArg      = function(key) {

    var index = process.argv.indexOf(key);
    var next = process.argv[index + 1];

    return (index < 0) ? null : (!next || next[0] === "-") ? true : next;
};

var config = module.exports = {

    /** Attributes */
    // Retrieving environment from environment variable
    environment     : (process.env.WWW_ENV ? process.env.WWW_ENV : "development"),
    // Enable watching for changes in src files
    watching_mode   : true,
    // Application root path
    base_path        : "../../..",
    // Global config file
    paths           : {},

    /** Load function will set configuration variables */
    load: function load() {

        config.front = yaml.safeLoad(fs.readFileSync(config.base_path+'/config/builder.yml'));

        config.paths.sm_asset  = "../.."+config.front.paths.asset;
        config.paths.asset     = config.base_path+config.front.paths.asset;
        config.paths.public    = config.base_path+config.front.paths.public;
        config.paths.views     = config.base_path+config.front.paths.views;

        config.paths.css_to_sass = '../../src/sass/';

        config.paths.src = {
            js : {
                vendor   : [],
                browser  : [],
                app      : [],
                compiler : []
            },
            sass     : config.paths.asset+"/sass/*.scss",
            template : config.paths.asset+"/template/**/*.twig",
            html     : config.paths.public+"/views/**/*.html"
        };

        config.paths.dest = {
            js       : config.paths.public+"/js",
            css      : config.paths.public+"/css",
            template : config.paths.views
        };

        config.paths.watch = {
            js         : config.paths.asset+"/js/**/*.js",
            js_app     : [config.paths.asset+"/js/app/**/*.js", config.paths.asset+"/js/app.js"],
            js_vendors : [config.paths.asset+"/js/vendor/**/*.js"],
            sass       : config.paths.asset+"/sass/**/*.scss",
            template   : config.paths.asset+"/template/**/*.twig"
        };
    },


    /**
     * Rocket front configuration added some paths to configuration file
     * we add them by merging two objects
     * @TODO: Optimize
     */
    addVendors : function addVendors() {

        if( config.front.vendor.app ) {

            config.front.vendor.app.forEach(function (library) {

                if (typeof library == 'string') {

                    config.paths.src.js.vendor.push(config.paths.asset + '/js/vendor/' + library + '.js');
                }
                else {

                    for (var path in library) {

                        library[path].forEach(function (element) {

                            config.paths.src.js.vendor.push(config.paths.asset + '/js/vendor/' + path + '/' + element + '.js');
                        });
                    }
                }
            });
        }
        else{

            config.paths.src.js.vendor = false;
        }


        if( config.front.vendor.browser ) {

            config.front.vendor.browser.forEach(function (library) {

                    config.paths.src.js.browser.push(config.paths.asset + '/js/vendor/' + library + '.js');
            });
        }
        else{

            config.paths.src.js.browser = false;
        }

        config.paths.src.js.app.push(config.paths.asset+'/js/app/**/*.js');
        config.paths.src.js.app.push(config.paths.asset+'/js/app.js');

        config.front.vendor.compiler.forEach(function(library){

            if( typeof library == 'string' ){

                config.paths.src.js.compiler.push(config.paths.asset+'/js/vendor/'+library+'.js');
            }
            else{

                for ( var path in library ){

                    library[path].forEach(function(element){

                        config.paths.src.js.compiler.push(config.paths.asset+'/js/vendor/'+path+'/'+element+'.js');
                    });
                }
            }
        });

    },

    /**
     *  Common implementation for an error handler of a Gulp plugin
     */
    errorHandler : function errorHandler(title) {
        'use strict';

        return function(err) {
            gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
            this.emit('end');
        };
    },

    fileExists : function fileExists(filename) {
        try{
            fs.accessSync(filename);
            return true;
        }catch(e){
            return false;
        }
    },


/**
     * Initilization
     */
    init : function init() {

        /** Parameters evaluation **/
        // Production mode
        if (getArg("--production") || getArg("-p"))
            config.environment = 'production';

        // dev mode
        if (getArg("--development") || getArg("-d"))
            config.environment = 'development';


        gutil.log("Loading...");

        // Watching mode
        if (getArg("--no-watch") || config.environment != "development")
            config.watching_mode = false;

        config.load();
        config.addVendors();
    }
};

config.init();