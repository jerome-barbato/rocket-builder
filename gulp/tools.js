'use strict';

/*
 * todo: make as gulp module
 */

var gulp    = require('gulp'),
    fs      = require('fs'),
    fs_path = require('fs-path'),
    config  = require('./config'),
    chalk   = require('chalk'),
    gutil   = require('gulp-util');


/**
 * Create block and component task, add twig and scss file
 */
gulp.task('create', function () {

    var name = process.argv[3];

    if (!name.length)
    {
        gutil.log(chalk.red('The name is empty'));
        return;
    }

    var filename = name.toLowerCase();
    var path = config.paths.private + '/shared/' + filename;

    try
    {
        fs.statSync(path + '/' + filename + '.twig');
        gutil.log(chalk.red('This component already exists'));

    } catch (e)
    {
        fs_path.writeFile(path + '/' + filename + '.twig', "<div block=\"" + name.replace(/\//g, '-') + "\">\n\t\n</div>");
        gutil.log(chalk.green('Template created'));
    }

    try
    {
        fs.statSync(path + '/' + filename + '.scss');
        gutil.log(chalk.red('This stylesheet already exists'));

    } catch (e)
    {
        fs_path.writeFile(path + '/' + filename + '.scss', "." + name.replace(/\//g, '-') + "{\n\t\n}");
        gutil.log(chalk.green('Stylesheet created'));
    }
});
