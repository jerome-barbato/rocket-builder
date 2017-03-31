/**
 * Popin
 *
 * Copyright (c) 2017 - Metabolism
 * Author:
 *   - Metabolism <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 2.1.0
 *
 * Requires:
 *   - jQuery
 *
 * Changelog:
 *   # 1.3
 *   Added angular popin directive via popin module
 *
 *   #1.4
 *   Added popin-template directive when the popin is allready in the dom ( ex: nested meta-view )
 *   Empty meta-view on close if not removed
 *
 *   #2.0
 *   Each popin is now a new instance
 *
 **/
(function ($) {

    var Popin = function (id, content, context) 
    {
        var self          = this;
        var $html         = $('html');
        var $container    = $('.popin-container');
        var $popin        = false;
        var transitionEnd = 'webkitTransitionEnd.popin transitionend.popin msTransitionEnd.popin oTransitionEnd.popin';

        if( !$container.length )
            $container = $('body');

        /* Public */

        var config = {
            html: {

                popin: '<div class="popin">' +
                '<div class="valign"><div class="valign__middle popin__overlay">' +
                '<div class="popin__content"></div>' +
                '</div></div>' +
                '</div>',
                close: '<a class="popin__close"></a>'
            }
        };


        self.context = {
            remove: true
        };


        self.close = function () { close() };
        self.show  = function () { show() };
        self.get   = function () { return $popin };

        /* Contructor. */

        /**
         *
         */
        var construct = function ()
        {
            $popin = $('.popin--' + id);

            if ($popin.length)
            {
                $popin.trigger('popin.show');
            }
            else
            {
                self.context = $.extend(self.context, context);

                if (typeof(content) == "undefined" || content === false)
                    content = $('script[type="text/template"]#' + id).html();

                add(content);
                setupEvents();
            }
        };


        /* Private. */

        /**
         *
         */
        var setupEvents = function ()
        {
            $popin.click(function (e)
            {
                if ($(e.target).hasClass('popin__overlay') || $(e.target).hasClass('popin__close') || $(e.target).hasDataAttr('close'))
                    close();
            });

            $(document).on('click keypress', function (e)
            {
                if (e.which === 13)
                    close();
            });

            $popin.on('popin.close', function (e) { close() });
            $popin.on('popin.show', function (e) { show() });
        };


        var remove = function ()
        {
            if ($popin.length)
                $popin.remove();

            $(document).trigger('popin.removed', [id]);

            $popin = self.context = self = null;
        };


        var close = function ()
        {
            if (Modernizr && Modernizr.csstransitions)
            {
                $popin.attr('data-state', 'removing');

                $popin.one(transitionEnd, function ()
                {
                    if (self.context.remove)
                        remove();
                    else
                        $popin.attr('data-state', 'idle');

                    if (!$('.popin:visible').length)
                        $html.removeClass('has-popin');

                    $container.repaint();
                });
            }
            else
            {
                if (self.context.remove)
                    remove();
                else
                    $popin.attr('data-state', 'idle');

                if (!$('.popin:visible').length)
                    $html.removeClass('has-popin');
            }
        };


        var add = function (content)
        {
            if (!window.angular)
                content = content.populate(self.context);

            $popin       = $(config.html.popin);
            var $content = $popin.find('.popin__content');

            $content.append(content);

            if (!$content.find('.popin__close, [data-close]').length)
                $content.append(config.html.close);

            $container.append($popin);

            if ('angular' in window && angular.$injector)
            {
                angular.$injector.invoke(function ($compile, $rootScope)
                {
                    var scope = $popin.scope() || $rootScope.$new();
                    scope = angular.extend(scope, self.context);

                    //todo: find why context is not interpolated
                    $compile($popin.contents())(scope);
                });
            }

            show();
        };


        var show = function ()
        {
            $popin.attr('data-state', '').addClass('popin--' + id);

            $popin.repaint();

            $popin.attr('data-state', 'adding');

            $(document).trigger('popin.added', [$popin, id, self.context]);

            if (Modernizr && Modernizr.csstransitions)
            {
                $html.addClass('will-have-popin');
                $popin.one(transitionEnd, function ()
                {
                    $popin.attr('data-state', 'added');
                    $html.removeClass('will-have-popin').addClass('has-popin');
                });
            }
            else
            {
                $html.addClass('has-popin');
                $popin.attr('data-state', 'added');
            }
        };

        construct();

        return self;
    };


    var Popins = function ()
    {
        $(document).on('click', '[data-popin]', function (e)
        {
            e.preventDefault();
            var context = {};

            if ($(this).data('context'))
            {
                try
                {
                    context = $(this).data('context') ? JSON.parse('{' + $(this).data('context').replace(/'/g, '"') + '}') : {};
                } catch (e) {}
            }
            else
            {
                context = $(this).data();
            }

            new Popin($(this).data('popin'), false, context);
        });


        if (typeof dom !== "undefined")
        {
            dom.compiler.register('attribute', 'popin', function (elem, attrs)
            {
                elem.attr('data-popin', attrs.popin);

                if (attrs.context)
                {
                    elem.attr('data-context', attrs.context);
                    elem.removeAttr('context');
                }
            });
        }
    };

    new Popins();

    rocket       = typeof rocket == 'undefined' ? {} : rocket;
    rocket.popin = Popin;

})(jQuery);
