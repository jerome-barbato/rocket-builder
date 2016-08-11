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

var UITabs = function (config) {

    var that = this;

    that.context = {
        $toggle : false
    };

    that.config = {
        $element   : false,
        auto_close : true,
        open_first : true
    };


    that._setupEvents = function(){


    };

    /* Contructor. */

    /**
     *
     */
    that.__construct = function (config) {

        that.config = $.extend(that.config, config);

        that._setupEvents();
    };

    if( typeof DOMCompiler !== "undefined" ) {

        dom.compiler.register('attribute', 'tabs', function (elem) { elem.addClass('ui-tabs') });
        dom.compiler.register('attribute', 'tab-content', function (elem) { elem.addClass('ui-tab') });
        dom.compiler.register('attribute', 'tab-handler', function (elem) { elem.addClass('ui-tab__handler') });
    }


    that.__construct(config);
};


var ui = ui || {};
ui.tabs = new UITabs();
