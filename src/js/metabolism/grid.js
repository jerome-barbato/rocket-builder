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

if( typeof DOMCompiler !== "undefined" ) {


    dom.compiler.register('attribute', 'grid', function(elem, attrs) {

        elem.attr('data-grid', attrs.grid?attrs.grid:'');
    });


    dom.compiler.register('attribute', 'row', function(elem, attrs) {

        elem.attr('data-row' ,attrs.row?attrs.row:'');
    });


    dom.compiler.register('attribute', 'col', function(elem, attrs) {

        elem.attr('data-column', attrs.col?attrs.col:'');

        if( attrs.offsetBy ){

            $('<div data-column="'+attrs.offsetBy+'"></div>').insertBefore(elem);
            elem.removeAttr('offset-by');
        }
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

        if( attrs.size )
            elem.removeAttr('size');

        if( attrs.offsetBy ){

            $('<div data-column="'+attrs.offsetBy+'"></div>').insertBefore(elem);
            elem.removeAttr('offset-by');
        }

        return '<div data-column="'+(attrs.size?attrs.size:'')+'"><transclude/></div>';
    });
}
