/**
 * Bind
 *
 * Copyright (c) 2017 - Metabolism
 * Author:
 *   - Jérome Barbato <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 2.1
 *
 * Changelog
 * v2.0
 * css animations only, removed IE9 compat
 *
 * Requires:
 *   - jQuery
 *
 **/

var MetaBind = function() {

    var self = this;

    self.context = {
        $elements : []
    };

    self.config = {
    };


    self.add = function($element)
    {
        var type = $element.data('bind');
        var id   = $element.attr('href');
        var $target = $(id);

        if( !$target.length )
            return;

        if( type == 'click' )
            self._handleClick(id, $element, $target);
        else if( type == 'hover' )
            self._handleHover(id, $element, $target);
    };


    self._handleHover = function(id, $element, $target){

        $element.add($target).hover(function () {

                $element.addClass('active');
                $target.addClass('active');
            },
            function(){

                $element.removeClass('active');
                $target.removeClass('active');
            });
    };


    self._handleClick = function(id, $element, $target){

        $element.click(function(e)
        {
            e.preventDefault();

            $element.toggleClass('active');
            $target.toggleClass('active');
        });

        $(document).click(function(e)
        {
            var $click_target = $(e.target);

            if( $element.hasClass('active') && !$click_target.closest(id+', [href="'+id+'"]').length )
            {
                $element.removeClass('active');
                $target.removeClass('active');
            }
        });
    };


    /* Constructor. */

    self.__construct = function()
    {
        $('[data-bind]').initialize(function()
        {
            self.add( $(this) );
        });
    };


    if( typeof DOMCompiler !== 'undefined' )
    {
        dom.compiler.register('attribute', 'bind', function(elem, attrs)
        {
            elem.attr('data-bind', attrs.bind);

        },self.add);
    }


    self.__construct();
};


var meta = meta || {};
meta.bind = new MetaBind();
