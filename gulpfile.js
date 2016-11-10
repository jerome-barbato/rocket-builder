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

    // Quick access for scripts compilation
    var scripts   = "concat::scripts";

    // Quick access for template compilation
    var templates = "compile::templates";

    gulp.start("clean:views");

    gulp.start("concat::scripts");
    gulp.start("compress::script::browser");

    gulp.start("compile::style");
    gulp.start("compress::style");
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

            gulp.start("compile::style");
            gulp.start("compress::style");
        });

        gulp.start("watch::templates");
    }
});