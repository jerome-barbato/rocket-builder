/**
 * Tab
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

(function ($) {


    var Tab = function (config)
    {
        var self = this;

        self.context = {
            $tabs  : false,
            $tab   : false,
            current: 0
        };

        self.config = {
            $element: false,
            inline  : false
        };


        self._setupEvents = function ()
        {
            self.context.$tab_handlers.click(function (e)
            {
                e.preventDefault();
                self.open($(this).attr('href'));
            });
        };


        self.open = function (id)
        {
            self.context.$tab_handlers.removeClass('active').filter('[href="' + id + '"]').addClass('active');
            self.context.$tabs.hide().filter(id).show();

            self.current = id;

            if (self.context.id.length)
                cookies.set('meta-tab-' + self.context.id, id);
        };


        self._init = function ()
        {
            if (self.context.id)
            {
                var current_from_cookie = cookies.get('meta-tab-' + self.context.id);

                if (current_from_cookie)
                    self.open(current_from_cookie);
                else
                    self.open(self.context.$tab_handlers.first().attr('href'));
            }
            else
            {
                self.open(self.context.$tab_handlers.first().attr('href'));
            }
        };


        self._getElements = function ()
        {
            self.context.$tab_handlers = self.config.$element.find('[href^="#"]');

            self.context.$tabs = $();
            self.context.$tab_handlers.each(function ()
            {
                self.context.$tabs = self.context.$tabs.add(self.config.$element.find($(this).attr('href')));
            });

            self.context.$tabs.hide();
        };

        /* Contructor. */

        /**
         *
         */
        self.__construct = function (config)
        {
            if (config.inline)
                config.inline = config.inline.split(',');

            self.config = $.extend(self.config, config);

            self._getElements();

            self.context.id = self.config.$element.attr('id') || false;

            $.each(self.config.inline, function (i, type)
            {
                if (browser && browser[type])
                {
                    self.context.$tab_handlers.each(function (i)
                    {
                        if (self.context.$tabs.length > i)
                            self.context.$tabs.eq(i).insertAfter($(this));
                    });

                    self._getElements();

                    return false;
                }
            });

            self._setupEvents();
            self._init();
        };


        self.__construct(config);
    };


    var Tabs = function ()
    {
        var self = this;

        self.add = function ($tabs)
        {
            var context = {};

            if ($tabs.data('context'))
                try { context = JSON.parse('{' + $tabs.data('context').replace(/'/g, '"') + '}') } catch (e) {}
            else
                context = $tabs.data();

            context.$element = $tabs;

            new Tab(context);
        };


        /* Constructor. */

        self.__construct = function ()
        {
            $('[data-tabs]').initialize(function () { self.add($(this)); });
        };


        if (typeof dom !== 'undefined')
        {
            dom.compiler.register('attribute', 'tabs', function (elem)
            {
                elem.attr('data-tabs', 'true');

            }, self.add);
        }

        self.__construct();
    };

    rocket      = typeof rocket == 'undefined' ? {} : rocket;
    rocket.tabs = new Tabs();

})(jQuery);
