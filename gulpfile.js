/**
 * Gulp config
 * @author: Metabolism
 *
 */

'use strict';

global.fs      = require('fs');
global.gulp    = require('gulp');
global.del     = require('del');
global.gpath   = require('path');
global.gif     = require('gulp-if');
global.bundle  = require('gulp-bundle-assets');
global.gutil   = require('gulp-util');

gulp.watch   = require('gulp-watch');
global.config  = require('./src/Gulp/config');

var livereload  = require('gulp-livereload');


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

gulp.task('default', ['clean', 'compile', 'make', 'sync'], function ()
{
	if (config.watching_mode)
	{
		livereload.listen();

		compile_watch();
		make_watch();

		gulp.watch([config.paths.dist + gpath.sep + 'bundle' + gpath.sep + '*.*', config.paths.views + gpath.sep + '**' + gpath.sep + '*.*'], function (files) {

			livereload.changed(files);
		});
	}
});