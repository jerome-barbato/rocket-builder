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

var UIToggle = function (config) {

    var self = this;

    self.context = {
        $toggle : false
    };

    self.config = {
        $element   : false,
        auto_close : false,
        open_first : false,
        animate    : true,
        speed      : 400,
        easing     : 'easeInOutCubic'
    };


    self._setupEvents = function(){

        self.context.$toggle.click(function(){

            var $parent = $(this).parents('.ui-toggle');
            self.toggle( $parent );

            if( self.config.auto_close )
                self.close( self.context.$toggles.not($parent) );
        });
    };


    self.close = function( $toggle ){

        if( !$toggle.length )
            return;

        $toggle.each(function(){

            $(this).removeClass('ui-toggle--active');

            if( self.config.animate )
                $(this).find('.ui-toggle__content').stop().slideUp(self.config.speed, self.config.easing);
        });
    };


    self.toggle = function( $toggle ){

        if( !$toggle.length )
            return;

        $toggle.each(function(){

            $(this).toggleClass('ui-toggle--active');

            if( self.config.animate )
                $(this).find('.ui-toggle__content').stop().slideToggle(self.config.speed, self.config.easing);
        });
    };


    self.open = function( $toggle ){

        if( !$toggle.length )
            return;

        $toggle.each(function(){

            $(this).addClass('ui-toggle--active');

            if( self.config.animate )
                $(this).find('.ui-toggle__content').stop().slideDown(self.config.speed, self.config.easing);
        });
    };


    /* Contructor. */

    /**
     *
     */
    self.__construct = function (config) {

        self.config = $.extend(self.config, config);

        if( self.config.$element.hasClass('.ui-toggle') )
            self.context.$toggles = self.config.$element;
        else
            self.context.$toggles   = self.config.$element.find('.ui-toggle');

        self.context.$toggles.each(function(){

            var $element = $(this);
            var context = $element.data('context') ? JSON.parse('{' + $element.data('context').replace(/'/g, '"') + '}') : {};
            $element.removeAttr('data-context');

            $.each( context.disable, function(i, device){

                if( browser && browser[device] ){

                    $element.removeClass('ui-toggle');
                    $element.find('.ui-toggle__handler').removeClass('ui-toggle__handler');
                    $element.find('.ui-toggle__content').removeClass('ui-toggle__content');
                }
            });
        });

        self.context.$toggle = self.config.$element.find('.ui-toggle__handler');

        if( self.config.open_first )
            self.open( self.context.$toggles.first() );

        self._setupEvents();
    };


    self.__construct(config);
};


var UIToggles = function () {

    var self = this;

    self.toggles = [];


    self.add = function( $toggle ){

        if( $toggle.data('ui-toggles--initialized') )
            return;

        $toggle.data('ui-toggles--initialized', true);
        $toggle.find('.ui-toggle').data('ui-toggles--initialised', true);

        var context = $toggle.data('context') ? JSON.parse('{' + $toggle.data('context').replace(/'/g, '"') + '}') : {};
        context.$element = $toggle;

        $toggle.removeAttr('data-context');

        self.toggles.push( new UIToggle(context) );
    };


    /* Constructor. */

    self.__construct = function () {

        $('.ui-toggles').initialize(function () { self.add( $(this) ) });
    };


    if( typeof DOMCompiler !== "undefined" ) {

        dom.compiler.register('attribute', 'toggles', function (elem, attrs) {

            elem.addClass('ui-toggles');

            if( attrs.toggles.length )
                dom.compiler.attr(elem, 'context', attrs.toggles);

        },self.add);

        dom.compiler.register('attribute', 'toggle', function (elem, attrs) {

            elem.addClass('ui-toggle');

            if( attrs.toggle.length )
                dom.compiler.attr(elem, 'context', attrs.toggle);
        });

        dom.compiler.register('attribute', 'toggle-handler', function (elem) { elem.addClass('ui-toggle__handler') });
        dom.compiler.register('attribute', 'toggle-content', function (elem) { elem.addClass('ui-toggle__content') });
    }


    self.__construct();
};


var ui = ui || {};
ui.toggles = new UIToggles();
