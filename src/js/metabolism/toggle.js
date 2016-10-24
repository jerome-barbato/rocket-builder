/**
 * Toggle
 *
 * Copyright (c) 2014 - Metabolism
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

var UXToggle = function(config) {

    var self = this;

    self.context = {
        $toggle : false,
        disable : false
    };

    self.config = {
        $element   : false,
        auto_close : false,
        open_first : false,
        animate    : true,
        speed      : 300,
        easing     : 'easeInOutCubic'
    };


    self._setupEvents = function(){

        self.context.$toggle.on('click keypress', function(e){

            if (e.which === 13 || e.type === 'click') {

                var $parent = $(this).parents('.ux-toggle');

                self.toggle( $parent );

                if( self.config.auto_close )
                    self.close( self.context.$toggles.not($parent) );
            }
        });
    };


    self.close = function( $toggle ){

        if( !$toggle.length )
            return;

        $toggle.each(function(){

            $(this).removeClass('ux-toggle--active');

            if( self.config.animate )
                $(this).find('.ux-toggle__content').stop().slideUp(self.config.speed, self.config.easing, function(){
                    $(document).trigger('ux-toggle.updated', ['close', $(this)])
                });
        });
    };


    self.toggle = function( $toggle ){

        if( !$toggle.length )
            return;

        $toggle.each(function(){

            $(this).toggleClass('ux-toggle--active');

            if( self.config.animate ){

                var $element = $(this).find('.ux-toggle__content');
                var is_visible = $element.is(':visible');
                $element.stop().slideToggle(self.config.speed, self.config.easing, function(){
                    if( is_visible )
                        $(document).trigger('ux-toggle.updated', ['close', $(this)])
                });

                if( !is_visible )
                    $(document).trigger('ux-toggle.updated', ['open', $(this)])
            }
        });
    };


    self.open = function( $toggle ){

        if( !$toggle.length )
            return;

        $toggle.each(function(){

            $(this).addClass('ux-toggle--active');

            if( self.config.animate ) {
                $(this).find('.ux-toggle__content').stop().slideDown(self.config.speed, self.config.easing);
                $(document).trigger('ux-toggle.updated', ['open', $(this)]);
            }
        });
    };


    /* Contructor. */

    /**
     *
     */
    self.__construct = function(config) {

        self.config = $.extend(self.config, config);

        if( self.config.$element.hasClass('.ux-toggle') )
            self.context.$toggles = self.config.$element;
        else
            self.context.$toggles   = self.config.$element.find('.ux-toggle');

        self.context.$toggle = self.config.$element.find('.ux-toggle__handler');

        if( self.config.open_first )
            self.open( self.context.$toggles.first() );

        self._setupEvents();
    };


    self.__construct(config);
};


var UXToggles = function() {

    var self = this;

    self.toggles = [];


    self.add = function( $toggle ){

        if( $toggle.data('ux-toggles--initialized') )
            return;

        $toggle.data('ux-toggles--initialized', true);
        $toggle.find('.ux-toggle').data('ux-toggles--initialised', true);

        var context = {};

        try {
            context = $toggle.data('context') ? JSON.parse('{' + $toggle.data('context').replace(/'/g, '"') + '}') : {};
        } catch(e) {}

        context.$element = $toggle;

        $toggle.removeAttr('data-context');

        self.toggles.push( new UXToggle(context) );
    };


    /* Constructor. */

    self.__construct = function() {

        $('.ux-toggles').initialize(function() { self.add( $(this) ); });
    };


    if( typeof DOMCompiler !== 'undefined' ) {

        dom.compiler.register('attribute', 'toggle', function(elem, attrs) {

            elem.addClass('ux-toggle');

            if( attrs.toggle.length )
                dom.compiler.attr(elem, 'context', attrs.toggle);
        });

        dom.compiler.register('attribute', 'toggle-handler', function(elem) { elem.addClass('ux-toggle__handler'); });
        dom.compiler.register('attribute', 'toggle-content', function(elem) { elem.addClass('ux-toggle__content'); });

        dom.compiler.register('attribute', 'toggles', function(elem, attrs) {

            elem.addClass('ux-toggles');

            if( attrs.toggles.length )
                dom.compiler.attr(elem, 'context', attrs.toggles);

        },self.add);
    }


    self.__construct();
};


var ux = ux || {};
ux.toggles = new UXToggles();
