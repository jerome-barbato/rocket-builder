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

    $(window).load(function(){

        $('[data-defer]').initialize(function(){

            $(this).attr('src', $(this).data('defer') );
            $(this).removeAttr('data-defer');

            if( $.fn.fit )
                $(this).fit(true);
        });
    });

    if( typeof DOMCompiler !== "undefined" ) {

        dom.compiler.register('attribute', 'defer', function(elem, attrs) {

            if( !elem.is("script") ){

                if( window.precompile )
                    elem.attr('src', "{{ blank() }}");

                if( attrs.defer )
                    dom.compiler.attr(elem, 'defer', attrs.defer);
            }
        });
    }
};


var ux = ux || {};
ux.defer = new UXDefer();
