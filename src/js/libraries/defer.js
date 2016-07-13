/**
 * Defer
 *
 * Copyright (c) 2014 - Metabolism
 * Author:
 *   - Jérome Barbato <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 1.0
 *
 * Changelog
 *
 * Requires:
 *   - jQuery
 *
 **/

var UIDefer = function () {

    var that = this;

    that.__construct = function(){

        $('.ui-defer').each(function(){

            $(this).attr('src', $(this).data('src') );
            $(this).removeAttr('data-src');
        });
    };

    $(document).on('loaded', that.__construct);


    if( typeof DOMCompiler !== "undefined" ) {

        dom.compiler.register('attribute', 'defer', function (elem, attrs) {

            if( !elem.is("script") ){

                elem.addClass('ui-defer');
            }
        });
    }
};


var ui = ui || {};
ui.defer = new UIDefer();
