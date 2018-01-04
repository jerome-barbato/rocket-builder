'use strict';

/**
 *  Pack vendor from node_modules
 */

var syncy = require('syncy');

var paths = [
	config.paths.src+'/component/**/*.*',
	'!'+config.paths.src+'/component/**/*.js',
	'!'+config.paths.src+'/component/**/*.scss',
	'!'+config.paths.src+'/component/**/*.twig',
	'!'+config.paths.src+'/component/**/*.tpl'
];

function synchronize(done){

	syncy(paths, config.paths.dist+'/media/component/',
		{
			verbose: true,
			base: config.paths.src+'/component/',
			updateAndDelete: true

		}).then(function(){

			if(typeof done === 'function')
				done();

		}).catch(function(err){

			if(typeof done === 'function')
				done(err);
		});
}

gulp.task('sync', function(done){

	synchronize(done);

	if (config.watching_mode)
	{
		gulp.watch(paths, function (files) {

			synchronize();
		});
	}
});