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

        var properties = "grid";

        if( attrs.grid )
            properties += ' grid--'+attrs.grid;

        elem.addClass(properties);
    });


    dom.compiler.register('attribute', 'row', function(elem, attrs) {

        var properties = "g-row";

        if( attrs.row )
            properties += ' g-row--'+attrs.row;

        if( attrs.alignItems )
            properties += ' g-row--'+attrs.alignItems;

       elem.addClass(properties);
    });


    dom.compiler.register('attribute', 'col', function(elem, attrs) {

        var properties = "g-col";

        attrs.col = attrs.col.split('/');
        if( attrs.col.length == 2 && attrs.col[0] != attrs.col[1] )
            properties += ' g-col--'+attrs.col[0]+'_'+attrs.col[1];

        if( attrs.offsetBy )
            properties += ' g-col---'+attrs.offsetBy.replace('/','_');

        elem.addClass(properties);
    });


    dom.compiler.register('element', 'grid', function(elem, attrs) {

        var properties = "grid";

        if( attrs.mod ){

          properties += ' grid--'+attrs.mod;
          elem.removeAttr('mod');
        }

        return '<div class="'+properties+'"><transclude/></div>';
    });


    dom.compiler.register('element', 'row', function(elem, attrs) {

        var properties = "g-row";

        if( attrs.mode )
            properties += ' g-row--'+attrs.mode;

        if( attrs.alignItems )
            properties += ' g-row--'+attrs.alignItems;

        return '<div class="'+properties+'"><transclude/></div>';
    });


    dom.compiler.register('element', 'column', function(elem, attrs) {

        var properties = "g-col";

        if( attrs.size ){

            properties += ' g-col--'+attrs.size.replace('/','_');
            elem.removeAttr('size');
        }

        if( attrs.offsetBy ){

            properties += ' g-col---'+attrs.offsetBy.replace('/','_');
            elem.removeAttr('offset-by');
        }

        return '<div class="'+properties+'"><transclude/></div>';
    });
}
