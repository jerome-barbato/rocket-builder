/**
 * Gulp config
 * @author: Metabolism
 *
 */

'use strict';

var gulp        = require('gulp'),
    fs          = require('fs'),
    config      = require('./gulp/config');


/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */

var files = fs.readdirSync('./gulp');

for (var i in files)
{
    if (files[i].split('.').pop() == 'js')
        require('./gulp/' + files[i]);
}


/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */

gulp.task('default', ["views::clean", "script::browser", "script::vendor", "script::app", "style::compile", "templates::compile"], function ()
{
    if (config.watching_mode)
    {
        gulp.start("template::watch");

        gulp.watch(config.paths.watch.js_app, ["script::app"]);
        gulp.watch(config.paths.watch.js_vendors, ["script::vendor", "templates::compile"]);
        gulp.watch(config.paths.watch.scss, ["style::compile"]);
    }
});
