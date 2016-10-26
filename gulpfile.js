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
    config  = require('./gulp/config');



/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */

var files = fs.readdirSync('./gulp');

for (var i in files) {
    if (files[i].split('.').pop() == 'js') {
        require('./gulp/'+files[i]);
    }
}



/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */

gulp.task('default', [], function () {

    // Quick access for style compilation
    var styles    = "compile::style";

    // Quick access for scripts compilation
    var scripts   = "concat::scripts";

    // Quick access for template compilation
    var templates = "compile::templates";

    /** Harlem Check **/
    if ( config.environment != 'development' ){

        styles  = "compress::style";
        scripts = "compress::scripts";
    }

    gulp.start("clean:views");

    gulp.start(scripts);
    gulp.start("compress::script::browser");

    gulp.start(styles);
    gulp.start(templates);

    if (config.watching_mode){

        gulp.watch(config.paths.watch.js_app, function() {

            gulp.start(scripts);
        });

        gulp.watch(config.paths.watch.js_vendors, function() {

            gulp.start(scripts);
            gulp.start(templates);
        });

        gulp.watch(config.paths.watch.sass, function() {

            gulp.start(styles);
        });

        gulp.start("watch::templates");
    }
});