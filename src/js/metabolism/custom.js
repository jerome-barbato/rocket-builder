/**
 * Custom
 *
 * Copyright (c) 2017 - Metabolism
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

(function($){

    var CustomInput = function()
    {
        var self = this;

        /* Constructor. */

        self.__construct = function()
        {
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
                    },
                    _resizeMenu: function() {
                        this.menu.outerWidth( this.button.outerWidth() - 2 );
                    }
                });

                $('select[data-custom]').initialize(function()
                {
                    var $parent = $(this).parent();

                    var options = {
                        icons: { button: 'ui-icon ui-icon-arrow' },
                        change: function( event, ui ) {

                            if( $(this).val().length )
                                $element.addClass('ui-selectmenu-button-filled');
                            else
                                $element.removeClass('ui-selectmenu-button-filled');
                        },
                        appendTo: $parent
                    };

                    if( $(this).hasDataAttr('placeholder') )
                        options.placeholder = $(this).data('placeholder');

                    $(this).selectmenu(options);

                    var $element = $(this).selectmenu( 'widget' );
                });
            }
        };


        if( typeof dom !== 'undefined' )
        {
            dom.compiler.register('attribute', 'custom', function(elem, attrs)
            {
                elem.attr('data-custom', 'true');

                if( attrs.placeholder )
                {
                    elem.attr('data-placeholder', attrs.placeholder);
                    elem.removeAttr('placeholder');
                }
            });
        }


        self.__construct();
    };

    rocket = typeof rocket == 'undefined' ? {} : rocket;
    rocket.custom = new CustomInput();

})(jQuery);
