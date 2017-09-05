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
            if( 'ui' in $ ){

                if( 'selectmenu' in $.ui )
                {
                    $.widget('app.selectmenu', $.ui.selectmenu, {
                        _drawButton: function () {
                            this._super();
                            var selected = this.element.find('[selected]').length,
                                placeholder = this.options.placeholder;

                            if (!selected && placeholder)
                                this.buttonItem.text(placeholder);

                            if(selected)
	                            this.button.addClass('ui-selectmenu-button-filled');
                        },
                        refresh: function () {
		                    this._super();
		                    var selected = this.element.find('[selected]').length,
			                    placeholder = this.options.placeholder;

		                    if (!selected && placeholder)
			                    this.buttonItem.text(placeholder);

		                    if(selected)
			                    this.button.addClass('ui-selectmenu-button-filled');
	                    },
                        _resizeMenu: function () {

                            var offset = this.element.data('menu_offset');
                            if (typeof offset == "undefined")
                                offset = 0;
                            else
                                offset = parseInt(offset);

                            this.menu.css('min-width', this.button.outerWidth() - offset - 2);
                        }
                    });


                    $('select[data-custom]').initialize(function ()
                    {
                        var $select = $(this);
                        var $parent = $select.parent();

                        var options = {
                            icons: {button: 'ui-icon ui-icon-arrow'},
                            change: function (event, ui) {

                                if ($select.val().length)
                                    $element.addClass('ui-selectmenu-button-filled');
                                else
                                    $element.removeClass('ui-selectmenu-button-filled');

	                            $select.change();
                            },
                            appendTo: $parent
                        };

                        if ($select.hasDataAttr('placeholder'))
                            options.placeholder = $select.data('placeholder');

                        $select.selectmenu(options);

	                    $select.on('refresh', function(){

		                    $select.selectmenu( "refresh" );

		                    if ($select.val().length)
			                    $element.addClass('ui-selectmenu-button-filled');
		                    else
			                    $element.removeClass('ui-selectmenu-button-filled');
	                    });

                        var $element = $select.selectmenu('widget');
                    });
                }


                if( 'datepicker' in $.ui )
                {
                    $('input[data-custom="date"]').initialize(function () {

                        var $parent = $(this).parent();

                        var options = {
                            beforeShow:function(textbox, instance){

                                var $datepicker = instance.dpDiv;
                                $parent.append($datepicker);
                                setTimeout(function(){
                                    $datepicker.css({position:'absolute', left:0, top:'100%', visibility:'visible'})
                                });
                            }
                        };

                        $(this).datepicker(options);
                    });
                }
            }
        };


        if( typeof dom !== 'undefined' )
        {
            dom.compiler.register('attribute', 'custom', function(elem, attrs)
            {
                elem.attr('data-custom', attrs.custom.length ? attrs.custom : 'true');

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
