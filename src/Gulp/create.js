'use strict';

/*
 * todo: make as gulp module
 */

var fs_path = require('fs-path'),
    chalk   = require('chalk');


/**
 * Create block and component task, add twig and scss file
 */
gulp.task('create', function (cb) {

	var name = process.argv[4];

	if (!name.length)
	{
		gutil.log(chalk.red('The name is empty'));
		return;
	}

	var filename = name.toLowerCase();
	var path = config.paths.private.root + gpath.sep + 'shared' + gpath.sep + filename;

	try
	{
		fs.statSync(path + gpath.sep + filename + '.twig');
		gutil.log(chalk.red('This component already exists'));

	} catch (e)
	{
		fs_path.writeFile(path + gpath.sep + filename + '.twig', "<div block=\"" + name.replace(/\//g, '-') + "\">\n\t\n</div>");
		gutil.log(chalk.green('Template created'));
	}

	try
	{
		fs.statSync(path + gpath.sep + filename + '.scss');
		gutil.log(chalk.red('This stylesheet already exists'));

	} catch (e)
	{
		fs_path.writeFile(path + gpath.sep + filename + '.scss', "." + name.replace(/\//g, '-') + "{\n\t\n}");
		gutil.log(chalk.green('Stylesheet created'));
	}
});
