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

    var that = this;

    that.context = {
        $toggle : false
    };

    that.config = {
        $element   : false,
        auto_close : false,
        open_first : false,
        animate    : true,
        speed      : 400,
        easing     : 'easeInOutCubic'
    };


    that._setupEvents = function(){

        that.context.$toggle.click(function(){

            var $parent = $(this).parents('.ui-toggle');
            that.toggle( $parent );

            if( that.config.auto_close )
                that.close( that.context.$toggles.not($parent) );
        });
    };


    that.close = function( $toggle ){

        if( !$toggle.length )
            return;

        $toggle.each(function(){

            $(this).removeClass('ui-toggle--active');

            if( that.config.animate )
                $(this).find('.ui-toggle__content').stop().slideUp(that.config.speed, that.config.easing);
        });
    };


    that.toggle = function( $toggle ){

        if( !$toggle.length )
            return;

        $toggle.each(function(){

            $(this).toggleClass('ui-toggle--active');

            if( that.config.animate )
                $(this).find('.ui-toggle__content').stop().slideToggle(that.config.speed, that.config.easing);
        });
    };


    that.open = function( $toggle ){

        if( !$toggle.length )
            return;

        $toggle.each(function(){

            $(this).addClass('ui-toggle--active');

            if( that.config.animate )
                $(this).find('.ui-toggle__content').stop().slideDown(that.config.speed, that.config.easing);
        });
    };


    /* Contructor. */

    /**
     *
     */
    that.__construct = function (config) {

        that.config = $.extend(that.config, config);

        if( that.config.$element.hasClass('.ui-toggle') )
            that.context.$toggles = that.config.$element;
        else
            that.context.$toggles   = that.config.$element.find('.ui-toggle');

        that.context.$toggles.each(function(){

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

        that.context.$toggle = that.config.$element.find('.ui-toggle__handler');

        if( that.config.open_first )
            that.open( that.context.$toggles.first() );

        that._setupEvents();
    };


    that.__construct(config);
};


var UIToggles = function () {

    var that = this;

    that.toggles = [];


    that.add = function( $toggle ){

        if( $toggle.data('ui-toggles--initialized') )
            return;

        $toggle.data('ui-toggles--initialized', true);
        $toggle.find('.ui-toggle').data('ui-toggles--initialised', true);

        var context = $toggle.data('context') ? JSON.parse('{' + $toggle.data('context').replace(/'/g, '"') + '}') : {};
        context.$element = $toggle;

        $toggle.removeAttr('data-context');

        that.toggles.push( new UIToggle(context) );
    };


    /* Constructor. */

    that.__construct = function () {

        $('.ui-toggles').initialize(function () { that.add( $(this) ) });
    };


    if( typeof DOMCompiler !== "undefined" ) {

        dom.compiler.register('attribute', 'toggles', function (elem, attrs) {

            elem.addClass('ui-toggles');

            if( attrs.toggles.length )
                dom.compiler.attr(elem, 'context', attrs.toggles);

        },that.add);

        dom.compiler.register('attribute', 'toggle', function (elem, attrs) {

            elem.addClass('ui-toggle');

            if( attrs.toggle.length )
                dom.compiler.attr(elem, 'context', attrs.toggle);
        });

        dom.compiler.register('attribute', 'toggle-handler', function (elem) { elem.addClass('ui-toggle__handler') });
        dom.compiler.register('attribute', 'toggle-content', function (elem) { elem.addClass('ui-toggle__content') });
    }


    that.__construct();
};


var ui = ui || {};
ui.toggles = new UIToggles();
