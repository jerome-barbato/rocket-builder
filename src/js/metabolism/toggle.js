/**
 * Toggle
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

var MetaToggle = function(config) {

    var self = this;

    self.context = {
        $toggles : false,
        $tabs    : false,
        disable  : false
    };

    self.config = {
        $element   : false,
        auto_close : false,
        open_first : false,
        animate    : true,
        speed      : 300,
        easing     : 'easeInOutCubic'
    };


    self._setupEvents = function()
    {
        self.context.$toggles.on('click keypress', function(e)
        {
            if (e.which === 13 || e.type === 'click')
            {
                self.toggle( $(this).attr('href') );

                if( self.config.auto_close )
                {
                    self.context.$toggles.not( $(this) ).each(function()
                    {
                        self.close( $(this).attr('href') );
                    });
                }
            }
        });
    };


    self.close = function( id, animate ){

        var $tab = self.context.$tabs.filter(id);
        var $toggle = self.context.$toggles.filter('[href="'+id+'"]');

        if( !$tab.length )
            return;

        $tab.removeClass('active');
        $toggle.removeClass('active');

        if( typeof animate !='undefined' ? animate : self.config.animate )
        {
            $tab.stop().slideUp(self.config.speed, self.config.easing, function()
            {
                $(document).trigger('meta-toggle.updated', ['close', $tab])
            });
        }
        else
        {
            $tab.hide();
            $(document).trigger('meta-toggle.updated', ['close', $tab]);
        }
    };


    self.toggle = function( id, animate )
    {
        var $tab = self.context.$tabs.filter(id);

        if( !$tab.length )
            return;

        if( $tab.is(':visible') )
            self.close(id, animate);
        else
            self.open(id, animate);
    };


    self.open = function( id, animate )
    {
        var $tab = self.context.$tabs.filter(id);
        var $toggle = self.context.$toggles.filter('[href="'+id+'"]');

        if( !$tab.length )
            return;

        $tab.addClass('active');
        $toggle.addClass('active');

        if( typeof animate !='undefined' ? animate : self.config.animate )
        {
            $tab.stop().slideDown(self.config.speed, self.config.easing);
            $(document).trigger('meta-toggle.updated', ['open', $tab]);
        }
        else
        {
            $tab.show();
            $(document).trigger('meta-toggle.updated', ['close', $tab]);
        }
    };


    self._getElements = function()
    {
        self.context.$toggles = self.config.$element.find('[href^="#"]');

        self.context.$tabs = $();
        self.context.$toggles.each(function()
        {
            self.context.$tabs = self.context.$tabs.add( self.config.$element.find($(this).attr('href')) );
        });

        self.context.$tabs.hide();
    };


    /* Contructor. */

    /**
     *
     */
    self.__construct = function(config)
    {
        self.config = $.extend(self.config, config);

        self._getElements();

        if( self.config.open_first )
            self.open( self.context.$toggles.first().attr('href'), false );

        self._setupEvents();
    };


    self.__construct(config);
};


var MetaToggles = function() {

    var self = this;

    self.add = function( $toggle )
    {
        var context = {};

        if( $toggle.data('context') )
        {
            try { context = JSON.parse('{' + $toggle.data('context').replace(/'/g, '"') + '}') } catch(e) {}
        }
        else
        {
            context = $toggle.data();
        }

        context.$element = $toggle;

        new MetaToggle(context);
    };


    /* Constructor. */

    self.__construct = function()
    {
        $('[data-toggles="true"]').initialize(function()
        {
            self.add( $(this) );
        });
    };


    if( typeof DOMCompiler !== 'undefined' )
    {
        dom.compiler.register('attribute', 'toggles', function(elem)
        {
            elem.attr('data-toggles','true');

        },self.add);
    }


    self.__construct();
};


var meta = meta || {};
meta.toggles = new MetaToggles();
