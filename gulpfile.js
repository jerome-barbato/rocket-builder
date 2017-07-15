/**
 * Gulp config
 * @author: Metabolism
 *
 */

'use strict';

var gulp        = require('gulp'),
    fs          = require('fs'),
    config      = require('./src/Gulp/config'),
    livereload  = require('gulp-livereload');


/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */

var files = fs.readdirSync('./src/Gulp');

for (var i in files)
{
    if (files[i].split('.').pop() == 'js')
        require('./src/Gulp/' + files[i]);
}


/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */

gulp.task('default', ["views::clean", "script::browser", "script::vendor", "script::app", "style::compile", "templates::compile"], function ()
{
    if (config.watching_mode)
    {
        if (config.environment === 'development')
            livereload.listen();

        gulp.start("template::watch");

        gulp.watch(config.paths.watch.js.app, ["script::app"]);
        gulp.watch(config.paths.watch.js.vendors, ["script::vendor", "templates::compile"]);
        gulp.watch(config.paths.watch.scss, ["style::compile"]);

        if (config.environment === 'development') {

            gulp.watch([config.paths.dest.css + '/**/*.css', config.paths.dest.js + '/**/*.js', config.paths.dest.views + '/**/*.*' ], function (files) {
                livereload.changed(files)
            });
        }
    }
});
