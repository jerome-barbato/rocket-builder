'use strict';

/*
 * todo: make as gulp module
 */

var gulp    = require('gulp'),
    fs      = require('fs'),
    config  = require('./config'),
    gutil   = require('gulp-util'),
    chalk   = require('chalk'),
    $       = require('gulp-load-plugins')(
        {
            pattern: ['gulp-*', 'jsdom', 'through2'],
            rename: {
                'through2' : 'through',
                'gulp-angular-htmlify' : 'htmlify',
                'gulp-angular-templatecache' : 'templatecache'
            }
        }
    );

function loadDep(){

    var src = [];

    var needed_core  = config.front.compiler;

    src.push( fs.readFileSync(config.paths.base.src+'js/core/vendors/browser.js', 'utf-8') );

    needed_core.vendors.forEach(function(library){

        src.push( fs.readFileSync(config.paths.base.src+'js/core/vendors/'+library+'.min.js', 'utf-8') );
    });

    needed_core.polyfill.forEach(function(library){

        src.push( fs.readFileSync(config.paths.base.src+'js/core/polyfill/'+library+'.js', 'utf-8') );
    });

    needed_core.libraries.forEach(function(library){

        src.push( fs.readFileSync(config.paths.base.src+'js/core/libraries/'+library+'.js', 'utf-8') );
    });

    return src;
}



function compile(html, scripts, callback) {

    var virtualConsole = $.jsdom.createVirtualConsole().sendTo(console);

    if( html.indexOf('<!-- jsdom:disabled -->') != -1 ){

        html = html.replace('<!-- jsdom:disabled -->','');
        callback(new Buffer(html));
    }
    else {

        html = html.replace(/<template /g, '<xtemplate ').replace(/<\/template>/g, '</xtemplate>');

        $.jsdom.env({
            html           : html,
            src            : scripts,
            virtualConsole : virtualConsole,
            done : function (err, window) {

                window.precompile    = true;
                window._DEBUG        = false;
                window.compact_class = config.front.compiler.compact;

                var $        = window.$;
                var compiler = window.dom.compiler;
                var $body    = $('body');

                compiler.run($body);
                html = $body.html();

                html = html.replace(/<xtemplate /g, '<template ').replace(/<\/xtemplate>/g, '</template>');
                html = html.replace(/protect=\"([^"]*)\"/g, "$1");
                callback(new Buffer(html));
            }
        });
    }
}



function compileFiles() {

    var scripts = loadDep();

    return $.through.obj(function(file, enc, cb) {

        var raw_html = file.contents.toString('utf8');

        compile(raw_html, scripts, function(compiled_html){

            file.contents = compiled_html;
            cb(null, file);
        });
    });
}



/**
 * Rocket directives post-processing with Rocket Dom Compiler
 */
gulp.task('watch::templates', function() {

    return gulp.watch(config.paths.src.template, function(event) {

        var path_array = event.path.split('/');
        var filename  = path_array[path_array.length-1];

        path_array.pop();
        var filepath  = path_array.join('/').replace('resources/src/template', 'views');
        gutil.log("Compiled '"+chalk.blue(filename)+"'");

        return gulp.src(event.path)
            .pipe(compileFiles())
            .pipe(gulp.dest(filepath));
    });
});



/**
 * Rocket directives post-processing with Rocket Dom Compiler
 */
gulp.task('compile::templates', function() {

    return gulp.src(config.paths.src.template)
        .pipe(compileFiles())
        .pipe(gulp.dest(config.paths.dest.template));
});