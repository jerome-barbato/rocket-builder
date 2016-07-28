/**
 * Gulp config
 * @version: 1.5
 * @author: Metabolism
 *
 * CHANGELOG:
 */

'use strict';

var gulp    = require('gulp'),
    fs      = require('fs'),
    config  = require('./gulp/config'),
    wrench  = require('wrench'),
    $       = require('gulp-load-plugins')(
        {
            pattern: ['gulp-*', 'jsdom', 'through2'],
            rename: {
                'through2' : 'through',
                'gulp-angular-htmlify': 'htmlify',
                'gulp-angular-templatecache': 'templatecache'
            }
        }

    );



/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
wrench.readdirSyncRecursive('./gulp').filter(function(file) {

    return (/\.js$/i).test(file);

}).map(function(file) {

    require('./gulp/' + file);
});



/**
 * retrieve node arguments, given with "gulp" command
 * @param key
 * @returns {*}
 */
function getArg(key) {

    var index = process.argv.indexOf(key);
    var next = process.argv[index + 1];

    return (index < 0) ? null : (!next || next[0] === "-") ? true : next;
}


/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
gulp.task('default', [], function () {


    config.init();
    // Quick access for style compilation
    var styles          = "compile::style";

    // Quick access for scripts compilation
    var scripts         = "concat::scripts";

    // Quick access for template compilation
    var templates       = "compile::templates";

    /** Parameters evaluation **/
    // Production mode
    if (getArg("--production") || getArg("-p")) {
        config.environment = 'production';
        config.load();
    }

    // Framework
    if (getArg("--framework")) {
        config.framework = getArg("--framework");
        config.load();
    }

    // Theme name
    if (getArg("--theme")) {
        config.theme_name = getArg("--theme");
        config.load();
    }

    // Watching mode
    if (getArg("--no-watch") || config.environment == "production") {
        config.watching_mode = false;
        config.load();
    }

    /** Harlem Check **/
    if (config.environment == "production"){

        styles  = "compress::style";
        scripts = "compress::scripts";
    }

    config.load();

    gulp.start(scripts);
    gulp.start("compress::script::browser");

    gulp.start(styles);
    gulp.start(templates);

    if (config.watching_mode){

        gulp.watch(config.paths.watch.js, function() {

            gulp.start(scripts);
            gulp.start(templates);
        });

        gulp.watch(config.paths.watch.sass, function() {

            gulp.start(styles);
        });
        gulp.start("watch::templates");
    }

});
