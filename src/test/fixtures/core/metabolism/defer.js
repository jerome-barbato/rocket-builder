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

var UXDefer = function() {

    var self = this;

    self.__construct = function(){

        $('.ux-defer').initialize(function(){

            $(this).attr('src', $(this).data('src') );
            $(this).removeAttr('data-src').removeClass('ux-defer');
        });
    };

    self.__construct();


    if( typeof DOMCompiler !== "undefined" ) {

        dom.compiler.register('attribute', 'defer', function(elem, attrs) {

            if( !elem.is("script") ){

                if( window.precompile )
                    elem.attr('src', "{{ blank() }}");

                if( attrs.defer )
                    dom.compiler.attr(elem, 'src', attrs.defer);

                elem.addClass('ux-defer');
            }
        });
    }
};


var ux = ux || {};
ux.defer = new UXDefer();
