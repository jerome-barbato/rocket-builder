'use strict';

/*
 * todo: make as gulp module
 */

var gulp   = require('gulp'),
    fs     = require('fs'),
    config = require('./config'),
    gutil  = require('gulp-util'),
    gif    = require('gulp-if'),
    rename = require('gulp-rename'),
    chalk  = require('chalk'),
    del    = require('del'),
    gpath   = require('path'),
    $      =
    {
        through: require('through2'),
        jsdom  : require('jsdom')
    };


function loadDep()
{
    var src = [];

    config.paths.src.js.browser.forEach(function (library)
    {
        src.push(fs.readFileSync(library, 'utf-8'));
    });

    config.paths.src.js.compiler.forEach(function (library)
    {
        src.push(fs.readFileSync(library, 'utf-8'));
    });

    return src;
}


function compile(file, scripts, callback)
{
    var html    = file.contents.toString('utf8');
    var extname = file.path.split('.')[file.path.split('.').length - 1];
    var engine  = extname === 'tpl' ? 'smarty' : 'twig';

    var virtualConsole = $.jsdom.createVirtualConsole().sendTo(console);

    if (html.indexOf('<!-- jsdom:disabled -->') !== -1)
    {
        html = html.replace('<!-- jsdom:disabled -->', '');
        callback(new Buffer(html));
    }
    else
    {
        var escape_tags = ['template', 'table', 'tr', 'thead', 'th', 'tbody', 'tfoot', 'td', 'ul', 'li'];

        for(var i in escape_tags)
        {
            var escape_tag = escape_tags[i];
            html = html.split('<'+escape_tag+'>').join('<x'+escape_tag+'>');
            html = html.split('<'+escape_tag+' ').join('<x'+escape_tag+' ');
            html = html.split('</'+escape_tag+'>').join('</x'+escape_tag+'>');
        }

        $.jsdom.env({
            html          : html,
            src           : scripts,
            virtualConsole: virtualConsole,
            done          : function (err, window)
            {
                window.precompile = true;
                window.engine     = engine;
                window.app = false;

                var $body = window.jQuery('body');

                window.dom.compiler.run($body);

                html = $body.html();

                if (config.environment === 'development' && html.indexOf('{% extends') === -1)
                {
                    var path = file.path.substring(file.path.indexOf(gpath.sep+'private'+gpath.sep)).replace(gpath.sep+'private'+gpath.sep, '');
                    html = "<!-- "+path+" -->\n" + html;
                }


                for (var i in escape_tags)
                {
                    var escape_tag = escape_tags[i];

                    html = html.split('<x' + escape_tag + ' ').join('<' + escape_tag + ' ');
                    html = html.split('<x' + escape_tag + '>').join('<' + escape_tag + '>');
                    html = html.split('</x' + escape_tag + '>').join('</' + escape_tag + '>');
                }

                html = html.replace(/<template /g, '<script type="text/template" ').replace(/<\/template>/g, '</script>');
                html = html.replace(/protect=\"([^"]*)\"/g, "$1");
                html = html.replace(/&gt;/g, ">").replace(/&lt;"/g, "<").replace(/&quot;/g, "\"");

                callback(new Buffer(html));
            }
        });
    }
}


function compileFiles()
{
    var scripts = loadDep();

    return $.through.obj(function (file, enc, cb)
    {
        compile(file, scripts, function (compiled_html)
        {
            file.contents = compiled_html;
            cb(null, file);
        });
    });
}


function getCompiledPath(path)
{
    var dirname = path.dirname.split(gpath.sep);
    var lastdir = dirname[dirname.length-1];

    if( lastdir === path.basename )
    {
        dirname.pop();
        path.dirname = dirname.join(gpath.sep);
    }

    return path;
}


function baseName(str)
{
    var base = String(str).substring(str.lastIndexOf(gpath.sep) + 1);

    if(base.lastIndexOf(".") !== -1)
        base = base.substring(0, base.lastIndexOf("."));

    return base;
}

/**
 * Rocket directives post-processing with Rocket Dom Compiler
 */
gulp.task('template::watch', function ()
{
    gulp.watch(config.paths.watch.template, function (event)
    {
        var path_array = event.path.split(gpath.sep);
        var filename   = path_array[path_array.length - 1];
        var lastdir    = path_array[path_array.length - 2];
        var basename   = baseName(filename);

        if( !filename || !filename.length )
            return;

        path_array.pop();

        if( lastdir === basename )
            path_array.pop();

        var filepath = path_array.join(gpath.sep).replace(config.paths.private.template.replace(config.base_path, ''), config.builder.paths.views);

        if (event.type === 'deleted')
        {
            gutil.log("Deleted '" + chalk.blue(filename) + "'");

            return del.sync([filepath + gpath.sep + filename], {force: true});
        }
        else
        {
            gutil.log("Compiled '" + chalk.blue(filename) + "'");

            return gulp.src(event.path)
                       .pipe(gif(config.builder.template.compile, compileFiles()))
                       .pipe(gulp.dest(filepath));
        }
    });
});


/**
 * Clean compiled views folder
 */
gulp.task('views::clean', function ()
{
    if (config.paths.dest.views.length)
        return del.sync([config.paths.dest.views + gpath.sep + '*'], {force: true});
});


/**
 * Rocket directives post-processing with Rocket Dom Compiler
 */
gulp.task('templates::compile', function ()
{
    return gulp.src(config.paths.src.template)
               .pipe(gif(config.builder.template.compile, compileFiles()))
               .pipe(rename(getCompiledPath))
               .pipe(gulp.dest(config.paths.dest.views));
});
