/**
 * configuration
 */

var builder_config_version = 2;

// Dependencies
var yaml  = require('js-yaml');

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
    base_path    : __dirname.replace(gpath.sep + 'vendor' + gpath.sep + 'metabolism' + gpath.sep + 'rocket-builder' + gpath.sep + 'src' + gpath.sep + 'Gulp', ''),
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

        if( typeof (config.builder.template.split) === 'undefined' )
	        config.builder.template.split = false;

        if( typeof (config.builder.template.simple_tree) === 'undefined' )
	        config.builder.template.simple_tree = true;

        if ('browsers' in config.builder.style === false)
        {
            config.builder.style.browsers = [
                "last 3 versions",
                "iOS 8"
            ];
        }

        config.paths.src    = config.base_path + config.builder.paths.src;
        config.paths.dist   = config.base_path + config.builder.paths.dist;
        config.paths.views  = config.base_path + config.builder.paths.views;
        config.paths.web    = config.base_path + gpath.sep + 'web' + gpath.sep;
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
    }
};

config.init();
