
/**
 * Configuration
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

var Config = module.exports = {

    /** Attributes */
    // Retrieving environment from environment variable
    environment     : (process.env.WWW_ENV ? process.env.WWW_ENV : "development"),
    // Enable watching for changes in src files
    watching_mode   : true,
    // Application root path
    app_path        : "../../../",
    // Src assets paths
    src_path        : "../../../src/asset/",
    // Public assets paths
    public_path     : "../../../web/public/",
    // Global config file
    paths           : {},

    /** Load function will set configuration variables */
    load: function load() {

        Config.paths = {
            base : {
                config   : Config.app_path+'config/front.yml',
                src      : Config.src_path,
                public   : Config.public_path
            },
            src : {
                js       : {
                    app      : [],
                    compiler : []
                },
                sass     : Config.src_path+"sass/*.scss",
                template : Config.src_path+"template/**/*.twig",
                html     : Config.public_path+"views/**/*.html"
            },
            dest : {
                js       : Config.public_path+"js",
                css      : Config.public_path+"css",
                template : Config.app_path+"web/views"
            },
            watch : {
                js         : Config.src_path+"js/**/*.js",
                js_app     : [Config.src_path+"js/app/**/*.js", Config.src_path+"js/app.js"],
                js_vendors : [Config.src_path+"js/vendors/**/*.js"],
                sass       : Config.src_path+"sass/**/*.scss",
                template   : Config.src_path+"template/**/*.twig"
            }
        };

        Config.front = yaml.safeLoad(fs.readFileSync(Config.paths.base.config));
    },


    /**
     * Rocket front configuration added some paths to configuration file
     * we add them by merging two objects
     * @TODO: Optimize
     */
    addVendors : function addVendors() {

        Config.front.vendors.app.forEach(function(library){

            if( typeof library == 'string' ){

                Config.paths.src.js.app.push(Config.src_path+'js/vendors/'+library+'.js');
            }
            else{

                for ( var path in library ){

                    library[path].forEach(function(element){

                        Config.paths.src.js.app.push(Config.src_path+'js/vendors/'+path+'/'+element+'.js');
                    });
                }
            }
        });

        Config.paths.src.js.app.push(Config.src_path+'js/app/**/*.js');
        Config.paths.src.js.app.push(Config.src_path+'js/app.js');

        Config.front.vendors.compiler.forEach(function(library){

            if( typeof library == 'string' ){

                Config.paths.src.js.compiler.push(Config.src_path+'js/vendors/'+library+'.js');
            }
            else{

                for ( var path in library ){

                    library[path].forEach(function(element){

                        Config.paths.src.js.compiler.push(Config.src_path+'js/vendors/'+path+'/'+element+'.js');
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
            Config.environment = 'production';

        // dev mode
        if (getArg("--development") || getArg("-d"))
            Config.environment = 'development';


        gutil.log("Loading...");

        // Watching mode
        if (getArg("--no-watch") || Config.environment != "development")
            Config.watching_mode = false;

        Config.load();
        Config.addVendors();
    }
};

Config.init();