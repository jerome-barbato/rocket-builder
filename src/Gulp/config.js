/**
 * configuration
 */

var builder_config_version = 1;

// Dependencies
var gutil = require('gulp-util'),
    fs    = require('fs'),
    gpath = require('path'),
    gulp  = require('gulp'),
    yaml  = require('js-yaml');

var getArg = function (key) {

    var index = process.argv.indexOf(key);
    var next  = process.argv[index + 1];

    return (index < 0) ? null : (!next || next[0] === "-") ? true : next;
};

var config = module.exports = {

    /** Attributes */
    // Retrieving environment from environment variable
    environment  : (process.env.WWW_ENV ? process.env.WWW_ENV : "development"),
    // Enable watching for changes in src files
    watching_mode: true,
    // Application root path
    base_path    : ".." + gpath.sep + ".." + gpath.sep + "..",
    // Global config file
    paths        : {},

    /** Load function will set configuration variables */
    load: function load() {

        try {
            config.builder = yaml.safeLoad(fs.readFileSync(config.base_path + gpath.sep + 'app' + gpath.sep + 'config' + gpath.sep + 'builder.yml'));
        }
        catch (e) {

            config.builder = yaml.safeLoad(fs.readFileSync(config.base_path + gpath.sep + 'config' + gpath.sep + 'builder.yml'));
        }

        if ('browsers' in config.builder.style == false)
        {
            config.builder.style.browsers = [
                "last 3 versions",
                "iOS 8"
            ];
        }

        config.paths.sm_private = ".." + gpath.sep + ".." + config.builder.paths.private;
        config.paths.public   = config.base_path + config.builder.paths.public;
        config.paths.views    = config.base_path + config.builder.paths.views;
        config.paths.split    = 'split_by_type' in config.builder.paths && config.builder.paths.split_by_type;

	    config.paths.private = {
	        root : config.base_path + config.builder.paths.private,
	    	js : config.base_path + config.builder.paths.private + (config.paths.split ? gpath.sep + 'js' : ''),
		    scss : config.base_path + config.builder.paths.private + (config.paths.split ? gpath.sep + 'scss' : ''),
		    template : config.base_path + config.builder.paths.private + (config.paths.split ? gpath.sep + 'template' : '')
	    };

        config.paths.css_to_sass = '..' + gpath.sep + 'private' + gpath.sep;

        config.paths.src = {
            js      : {
                vendor  : [],
                browser : [],
                app     : [],
                compiler: []
            },
	        scss    : config.paths.private.scss + gpath.sep + "*.scss",
            template: [
	            config.paths.private.template + gpath.sep + "**" + gpath.sep + "*.twig",
	            config.paths.private.template + gpath.sep + "**" + gpath.sep + "*.tpl"
            ],
            html    : config.paths.public + gpath.sep + "views" + gpath.sep + "**" + gpath.sep + "*.html"
        };

        config.paths.dest = {
            js      : config.paths.public + gpath.sep + "js",
            css     : config.paths.public + gpath.sep + "css",
	        views   : config.paths.views
        };

        config.paths.watch = {
            js        : {
                app    : [
                    config.paths.private.js + gpath.sep + "**" + gpath.sep + "*.js",
                    "!"+config.paths.private.js + gpath.sep + "vendor" + gpath.sep + "**" + gpath.sep + "*.js"
                ],
                vendors: [config.paths.private.js + gpath.sep + "vendor" + gpath.sep + "**" + gpath.sep + "*.js"]
            },
            scss      : config.paths.private.scss + gpath.sep + "**" + gpath.sep + "*.scss",
            template  : [
                config.paths.private.template + gpath.sep + "**" + gpath.sep + "*.twig",
                config.paths.private.template + gpath.sep + "**" + gpath.sep + "*.tpl"
            ]
        };
    },


    addApp: function addApp(){

        if (config.builder && config.builder.script && config.builder.script.app )
        {
            config.builder.script.app.forEach(function (element) {

                config.paths.src.js.app.push(config.paths.private.js + gpath.sep + element + '.js');
            });
        }
        else {

            config.paths.src.js.app = false;
        }
    },



    addLibs: function addVendor(libraries, additional_path, vendors) {

        libraries.forEach(function (library)
        {
            if (typeof library === 'string')
            {
                vendors.push(config.paths.private.js + gpath.sep + 'vendor' + gpath.sep + additional_path + library + '.js');
            }
            else
            {
                for (var path in library)
                {
                    config.addLibs(library[path], additional_path + path + gpath.sep, vendors);
                }
            }
        });
    },


    /**
     * Rocket front configuration added some paths to configuration file
     * we add them by merging two objects
     * @TODO: Optimize
     */
    addVendors: function addVendors() {

        if ( config.builder && config.builder.script && 'vendor' in config.builder.script )
        {
            config.addLibs(config.builder.script.vendor, '', config.paths.src.js.vendor);
        }
        else
        {
            config.paths.src.js.vendor = false;
        }


        if ( config.builder &&  config.builder.script && 'browser' in config.builder.script )
        {
            config.addLibs(config.builder.script.browser, '', config.paths.src.js.browser);
        }
        else
        {
            config.paths.src.js.browser = false;
        }
    },

    /**
     *  Common implementation for an error handler of a Gulp plugin
     */
    errorHandler: function errorHandler(title)
    {
        'use strict';

        return function (err) {
            gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
            this.emit('end');
        };
    },


    /**
     * Initilization
     */
    init: function init() {

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
        config.addApp();
    }
};

config.init();
