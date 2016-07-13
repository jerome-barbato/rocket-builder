/**
 * Gulp config
 * @version: 1.5
 * @author: Metabolism
 *
 * changelog:
 * #1.2
 * changed gulp-ruby-sass to gulp-sass
 * added gulp-css-globbing to allow @import '*'
 * #1.3
 * added front.config parsing
 * #1.4
 * refractoring, partialing, unity test addition, Rocket html compiler
 * #1.5
 * moved gulpfiles and package to core, added builder symlink
 */

'use strict';

var gulp    = require('gulp'),
    config  = require('./gulp/config'),
    fs      = require('fs'),
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

    var styles    = "compile::style",
        scripts   = "concat::scripts",
        templates = "compile::templates";

    if (getArg("--production") || getArg("-p")){

        styles  = "compress::style";
        scripts = "compress::scripts";
    }

    gulp.start(scripts);
    gulp.start("compress::script::browser");

    gulp.start(styles);
    gulp.start(templates);

    gulp.watch(config.paths.watch.js, function() {

        gulp.start(scripts);
        gulp.start(templates);
    });

    gulp.watch(config.paths.watch.sass, function() {

        gulp.start(styles);
    });

    gulp.start("watch::templates");
});
