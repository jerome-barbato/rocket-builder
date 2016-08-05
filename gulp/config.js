
/**
 * Configuration
 */

// Dependencies
var gutil       = require('gulp-util');
var fs          = require('fs');
var getArg      = function(key) {

    var index = process.argv.indexOf(key);
    var next = process.argv[index + 1];

    return (index < 0) ? null : (!next || next[0] === "-") ? true : next;
};

var Config = module.exports = {

    /** Attributes */
    // Retrieving environment from environment variable
    environment     : (process.env.WWW_ENV ? process.env.WWW_ENV : "development"),
    // Enable watching for changes in src files
    watching_mode   : true,
    // Framework parameter can be rocket, wordpress or silex
    framework       : "rocket",
    // Theme name will help to find src for compilation
    theme_name      : "meta",
    // Application root path
    app_path        : "../app/",
    // Src assets paths
    src_path        : "",
    // Public assets paths
    public_path     : "",
    // Global config file
    paths           : "",

    /** Load function will set configuration variables */
    load: function load() {

        // Application root path differ for each framework
        switch (Config.framework) {
            case "silex":
                Config.app_path    = "../app/";
                break;
            case "wordpress":
                Config.app_path    = "../../../web/app/themes/" + Config.theme_name + "/app/";
                break;
            default:
                Config.app_path    = "../app/";
        }

        Config.src_path    = Config.app_path+"resources/src/";
        Config.public_path = Config.app_path+"resources/public/";
        Config.paths = {
            base : {
                config   : Config.app_path+'config/front.config',
                src      : Config.src_path,
                public   : Config.public_path
            },
            src : {
                js       : [],
                sass     : Config.src_path+"sass/*.scss",
                template : Config.src_path+"template/**/*.twig",
                html     : Config.public_path+"views/**/*.html"
            },
            dest : {
                js       : Config.public_path+"js",
                css      : Config.public_path+"css",
                template : Config.app_path+"views"
            },
            watch : {
                js       : Config.src_path+"js/**/*.js",
                sass     : Config.src_path+"sass/**/*.scss",
                template : Config.src_path+"template/**/*.twig"
            }
        };

        Config.front = JSON.parse(fs.readFileSync(Config.paths.base.config));

            /*console.log("Status: \n" +
                "Path to config : " + Config.paths.base.config +
                "\nEnv : " + Config.environment +
                "\nFramework : " + Config.framework +
                "\nTheme : " + Config.theme_name);*/
    },


    /**
     * Rocket front configuration added some paths to configuration file
     * we add them by merging two objects
     * @TODO: Optimize
     */
    addCoreDependencies : function addCoreDependencies() {

        var needed_core  = Config.front.app;

        // Define js src order from front config
        needed_core.vendors.forEach(function(library){

            Config.paths.src.js.push(Config.src_path+'js/core/vendors/'+library+'.min.js');

            if( library == "angular" || library == "jquery" )
                Config.paths.src.js.push(Config.src_path+'js/core/vendors/'+library+'/**/*.js');
        });

        needed_core.polyfill.forEach(function(library){

            Config.paths.src.js.push(Config.src_path+'js/core/polyfill/'+library+'.js');
        });

        needed_core.libraries.forEach(function(library){

            Config.paths.src.js.push(Config.src_path+'js/core/libraries/'+library+'.js');
        });

        Config.paths.src.js.push(Config.src_path+'js/app.js');
        Config.paths.src.js.push(Config.src_path+'js/app/**/*.js');
        Config.paths.src.js.push(Config.src_path+'js/vendors/**/*.js');
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

    /**
     * Initilization
     */
    init : function init() {

        /** Parameters evaluation **/
        // Production mode
        if (getArg("--production") || getArg("-p"))
            Config.environment = 'production';

        // dev mode
        if (getArg("--development") || getArg("-d"))
            Config.environment = 'development';

        // Framework
        if (getArg("--framework"))
            Config.framework = getArg("--framework");

        // Theme name
        if (getArg("--theme"))
            Config.theme_name = getArg("--theme");

        // Watching mode
        if (getArg("--no-watch") || Config.environment == "production")
            Config.watching_mode = false;

        Config.load();
        Config.addCoreDependencies();
    }
};

Config.init();