'use strict';

/*
 * todo: make as gulp module
 */

var gif    = require('gulp-if'),
    rename = require('gulp-rename'),
    chalk  = require('chalk'),
    del    = require('del'),
    $      =
    {
        through: require('through2'),
        jsdom  : require('jsdom')
    };


var views_path  = config.paths.src + (config.builder.template.split ? gpath.sep + 'views' : '' );
var views_files = [ views_path + gpath.sep + "**" + gpath.sep + "*.twig", views_path + gpath.sep + "**" + gpath.sep + "*.tpl"];

function loadDep()
{
    var src = [];

    ['jquery','compiler','bem','attributes','elements','filters'].forEach(function (library)
    {
        src.push(fs.readFileSync('src' + gpath.sep + 'Gulp' + gpath.sep + 'dom' + gpath.sep + library + '.js', 'utf-8'));
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
                window.engine = engine;
                window.debug  = false;

                var $body = window.jQuery('body');

                window.dom.compiler.run($body);

                html = $body.html();

                if (config.environment === 'development' && html.indexOf('{% extends') === -1)
                {
                    var path = file.path.substring(file.path.indexOf(gpath.sep+'Resources'+gpath.sep)).replace(gpath.sep+'Resources'+gpath.sep, '');
                    html = "<!-- start "+path+" -->\n" + html + "\n<!-- end "+path+" -->";
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

    if( lastdir === path.basename && config.builder.template.simple_tree )
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
global.compile_watch = function ()
{
    gulp.watch(views_files, function (event)
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

        var filepath = path_array.join(gpath.sep).replace(views_path.replace(config.base_path, ''), config.builder.paths.views);

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
};

/**
 * Rocket directives post-processing with Rocket Dom Compiler
 */
gulp.task('compile', function ()
{
    return gulp.src(views_files)
               .pipe(gif(config.builder.template.compile, compileFiles()))
               .pipe(rename(getCompiledPath))
               .pipe(gulp.dest(config.paths.views));
});
