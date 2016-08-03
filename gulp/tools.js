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
 * Rocket directives post-processing with Rocket Dom Compiler
 */
gulp.task('create', function() {

    var type = process.argv[3].replace('--','');
    var name = process.argv[4];

    if( type != "block" && type != "component"){
        gutil.log(chalk.red('The type is not valid, use --block or --component'));
        return;
    }

    if( !name.length ){
        gutil.log(chalk.red('The name is empty'));
        return;
    }


    var path = {
        template : config.src_path+'template/',
        sass : config.src_path+'sass/app/'+type+'s/'
    };

    try {
        fs.statSync(path.template);
    } catch (e) {
        path.template = config.app_path+'views/';
    }

    path.template += type+'s/';

    try {
        fs.statSync(path.template+name+'.phtml.twig');
        gutil.log(chalk.red('This template allready exists'));
    } catch (e) {
        fs_path.writeFile(path.template+name+'.phtml.twig', "<div block=\""+name.replace(/\//g, '-')+"\">\n\t\n</div>");
        gutil.log(chalk.green('Template created'));
    }

    try {
        fs.statSync(path.sass+name+'.scss');
        gutil.log(chalk.red('This stylesheet allready exists'));
    } catch (e) {
        fs_path.writeFile(path.sass+name+'.scss', "."+name.replace(/\//g, '-')+"{\n\t\n}");
        gutil.log(chalk.green('Stylesheet created'));
    }
});