/**
 * Grid DOM Extensions
 *
 * Copyright (c) 2016 - Metabolism
 * Author:
 *   - Jérome Barbato <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 1
 *
 * Requires:
 *   - jQuery
 *
 **/

(function($){

    if( typeof dom == 'undefined' )
        return;

    var grid_breakpoints = ['tablet', 'mobile', 'tablet-portrait', 'mobile-portrait', 'wide', '13inch'];

    var camelCase = function(str) {

        return str
            .replace(/-/g, ' ')
            .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
            .replace(/\s/g, '')
            .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
    };

    dom.compiler.register('attribute', 'grid', function(elem, attrs) {

        elem.attr('data-grid', attrs.grid?attrs.grid:'');
    });


    dom.compiler.register('attribute', 'row', function(elem, attrs) {

        elem.attr('data-row' ,attrs.row?attrs.row:'');
    });


    dom.compiler.register('attribute', 'col', function(elem, attrs) {

        elem.attr('data-col', attrs.col?attrs.col:'');

        if( attrs.offsetBy ){

            $('<div data-col="'+attrs.offsetBy+'"></div>').insertBefore(elem);
            elem.removeAttr('offset-by');
        }

        $.each(grid_breakpoints, function(i, media){

            var c_media = camelCase('col-'+media);

            if( attrs[c_media] ){

                elem.attr('data-col-'+media, attrs[c_media]);
                elem.removeAttr('col-'+media);
            }
        });
    });


    dom.compiler.register('element', 'grid', function(elem, attrs) {

        if( attrs.mod )
            elem.removeAttr('mod');

        return '<div data-grid="'+(attrs.mod?attrs.mod:'')+'"><transclude/></div>';
    });


    dom.compiler.register('element', 'row', function(elem, attrs) {

        if( attrs.mod )
            elem.removeAttr('mod');

        return '<div data-row="'+(attrs.mod?attrs.mod:'')+'"><transclude/></div>';
    });


    dom.compiler.register('element', 'column', function(elem, attrs) {

        var attributes = ['data-col="'+(attrs.size?attrs.size:'')+'"'];

        if( attrs.size )
            elem.removeAttr('size');

        if( attrs.mod ){

            attributes.push('data-align="'+attrs.mod+'"');
            elem.removeAttr('mod');
        }

        if( attrs.offsetBy ){

            $('<div data-col="'+attrs.offsetBy+'"></div>').insertBefore(elem);
            elem.removeAttr('offset-by');
        }

        $.each(grid_breakpoints, function(i, media){

            var c_media = camelCase('size-'+media);
            if (attrs[c_media]) {

                attributes.push('data-col-' + media + '="' + attrs[c_media] + '"');
                elem.removeAttr('size-' + media);
            }
        });

        return '<div '+attributes.join(' ')+'><transclude/></div>';
    });

})(jQuery);
