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

var UXTab = function(config) {

    var self = this;

    self.context = {
        $tabs   : false,
        $tab    : false,
        current : 0
    };

    self.config = {
        $element   : false,
        block      : ['phone']
    };


    self._setupEvents = function(){

        self.context.$tab_handlers.click(function(e){

            e.preventDefault();
            self.open( self.context.$tab_handlers.index($(this)) );
        });

        self.context.$tabs.find('[data-tab]').click(function(e){

            e.preventDefault();
            self.open( parseInt($(this).data('tab'))-1 );
        });
    };


    self.open = function( i ){

        self.context.$tab_handlers.removeClass('ux-tabs--active').eq(i).addClass('ux-tabs--active');

        self.context.$tabs.removeClass('ux-tab--active');

        if( i <= self.context.$tabs.length )
            self.context.$tabs.eq(i).addClass('ux-tab--active');

        //$('html,body').animate({scrollTop: self.config.$element.offset().top - $('.ux-scroll-offset').height()}, 200, "easeInOutCubic");

        self.current = i;

        if( self.context.id.length )
            cookies.set('ux-tab-'+self.context.id, i);
    };


    self._init = function(){

        if( self.context.id ) {

            var current_from_cookie = cookies.get('ux-tab-' + self.context.id);

            if (current_from_cookie)
                self.open(current_from_cookie);
            else
                self.open(0);
        }else
            self.open(0);
    };


    /* Contructor. */

    /**
     *
     */
    self.__construct = function(config) {

        self.config = $.extend(self.config, config);

        self.context.$tab_handlers = self.config.$element.find('.ux-tabs__handler');
        self.context.$tabs = self.config.$element.nextAll('.ux-tab');
        self.context.id    = self.config.$element.attr('id') || false;

        $.each(self.config.block, function(i, block){

            if( browser && browser[block] ){

                self.context.$tab_handlers.each(function(i){

                    if( self.context.$tabs.length > i )
                        self.context.$tabs.eq(i).insertAfter($(this));
                });

                self.context.$tab_handlers = self.config.$element.find('.ux-tabs__handler');
                self.context.$tabs = self.config.$element.find('.ux-tab');
            }
        });

        self._setupEvents();
        self._init();
    };


    self.__construct(config);
};


var UXTabs = function() {

    var self = this;

    self.tabs = [];


    self.add = function( $tabs ){

        var context = {};
        try {
            context = $tabs.data('context') ? JSON.parse('{' + $tabs.data('context').replace(/'/g, '"') + '}') : {};
        } catch(e) {}

        context.$element = $tabs;

        $tabs.removeAttr('data-context');

        self.tabs.push( new UXTab(context) );
    };


    /* Constructor. */

    self.__construct = function() {

        $('.ux-tabs').initialize(function() { self.add( $(this) ); });
    };


    if( typeof DOMCompiler !== 'undefined' ) {

        dom.compiler.register('attribute', 'tabs', function(elem) { elem.addClass('ux-tabs'); }, self.add);
        dom.compiler.register('attribute', 'tab', function(elem) { elem.addClass('ux-tab'); });
        dom.compiler.register('attribute', 'tabs-handler', function(elem) { elem.addClass('ux-tabs__handler'); });
        dom.compiler.register('element', 'tab', function() { return '<div class="ux-tab"><transclude/></div>'; });
    }

    self.__construct();
};


var ux = ux || {};
ux.tabs = new UXTabs();
