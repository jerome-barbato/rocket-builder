'use strict';

/**
 *  Pack vendor from node_modules
 */
gulp.task('make', function() {
	return gulp.src( config.paths.src + gpath.sep + 'config' + gpath.sep + 'bundle.js')
		.pipe(bundle({quietMode: true, base: config.paths.src + gpath.sep, bundleAllEnvironments: true }))
		.pipe(bundle.results({fileName: 'manifest', dest: config.paths.web, pathPrefix:'BASE_PATH' + gpath.sep + 'static' + gpath.sep + 'bundle' + gpath.sep  }))
		.pipe(gulp.dest(config.paths.dist + gpath.sep + 'bundle' ));
});


global.make_watch = function() {

	bundle.watch({
		quietMode: false,
		base: config.paths.src + gpath.sep,
		bundleAllEnvironments: true,
		configPath: config.paths.src + gpath.sep + 'config' + gpath.sep + 'bundle.js',
		results: { dest: config.paths.web, pathPrefix: 'BASE_PATH' + gpath.sep + 'static' + gpath.sep + 'bundle' + gpath.sep, fileName: 'manifest'},
		dest: config.paths.dist + gpath.sep + 'bundle'
	});
};
