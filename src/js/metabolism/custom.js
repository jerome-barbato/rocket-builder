/**
 * Custom
 *
 * Copyright (c) 2014 - Metabolism
 * Author:
 *   - Jérome Barbato <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 1.0
 *
 * Changelog
 * v1.0
 *
 * Requires:
 *   - jQuery
 *
 **/

var UXCustomInput = function() {

    var self = this;

    /* Constructor. */

    self.__construct = function() {

        if( 'ui' in $ && $.ui.selectmenu ){

            $.widget( 'app.selectmenu', $.ui.selectmenu, {
                _drawButton: function() {
                    this._super();
                    var selected = this.element
                            .find( '[selected]' )
                            .length,
                        placeholder = this.options.placeholder;

                    if (!selected && placeholder) {
                        this.buttonItem.text(placeholder);
                    }
                }
            });

            $('select[data-custom]').initialize(function(){

                var options = {
                    icons: { button: "ux-icon ux-icon--selectmenu" }
                };

                if( $(this).hasDataAttr('placeholder') )
                    options.placeholder = $(this).data('placeholder');

                $(this).selectmenu(options);
            });
        }
    };


    if( typeof DOMCompiler !== 'undefined' ) {

        dom.compiler.register('attribute', 'custom', function(elem, attrs) {

            elem.attr('data-custom', attrs.custom);

            if( attrs.placeholder ){

                elem.attr('data-placeholder', attrs.placeholder);
                elem.removeAttr('placeholder');
            }
        });
    }


    self.__construct();
};


var ux = ux || {};
ux.custom = new UXCustomInput();
