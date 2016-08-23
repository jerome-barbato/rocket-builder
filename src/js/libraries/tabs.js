/**
 * Tab
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

var UITab = function (config) {

    var that = this;

    that.context = {
        $tabs : false,
        $tab  : false
    };

    that.config = {
        $element   : false,
        block      : ['phone']
    };


    that._setupEvents = function(){

        that.context.$tab_handlers.click(function(e){

            e.preventDefault();
            that.open( that.context.$tab_handlers.index($(this)) );
        });
    };


    that.open = function( i ){

        that.context.$tab_handlers.removeClass('ui-tabs--active').eq(i).addClass('ui-tabs--active');

        that.context.$tabs.removeClass('ui-tab--active');

        if( i <= that.context.$tabs.length )
            that.context.$tabs.eq(i).addClass('ui-tab--active');
    };


    /* Contructor. */

    /**
     *
     */
    that.__construct = function (config) {

        that.config = $.extend(that.config, config);

        that.context.$tab_handlers = that.config.$element.find('.ui-tabs__handler');
        that.context.$tabs = that.config.$element.nextAll('.ui-tab');

        $.each(that.config.block, function(i, block){

            if( browser && browser[block] ){

                that.context.$tab_handlers.each(function(i){

                    if( that.context.$tabs.length > i )
                        that.context.$tabs.eq(i).insertAfter($(this));
                });

                that.context.$tab_handlers = that.config.$element.find('.ui-tabs__handler');
                that.context.$tabs = that.config.$element.find('.ui-tab');
            }
        });

        that._setupEvents();
        that.open(0);
    };


    that.__construct(config);
};


var UITabs = function () {

    var that = this;

    that.tabs = [];


    that.add = function( $tabs ){

        var context = $tabs.data('context') ? JSON.parse('{' + $tabs.data('context').replace(/'/g, '"') + '}') : {};
        context.$element = $tabs;

        $tabs.removeAttr('data-context');

        that.tabs.push( new UITab(context) );
    };


    /* Constructor. */

    that.__construct = function () {

        $('.ui-tabs').initialize(function () { that.add( $(this) ) });
    };


    if( typeof DOMCompiler !== "undefined" ) {

        dom.compiler.register('attribute', 'tabs', function (elem) { elem.addClass('ui-tabs') }, that.add);
        dom.compiler.register('attribute', 'tab', function (elem) { elem.addClass('ui-tab') });
        dom.compiler.register('attribute', 'tabs-handler', function (elem) { elem.addClass('ui-tabs__handler') });
        dom.compiler.register('element', 'tab', function (elem) { return '<div class="ui-tab"><transclude/></div>' });
    }

    that.__construct();
};


var ui = ui || {};
ui.tabs = new UITabs();
