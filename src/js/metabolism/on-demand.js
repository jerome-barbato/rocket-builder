/**
 * On Demand Loader
 *
 * Copyright (c) 2017 - Metabolism
 * Author:
 *   - Jérome Barbato <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 1.3
 *
 *
 * Requires:
 *   - jQuery
 *
 **/
(function ($) {

    var OnDemand = function () {
        var self = this;

        self.context = {
            init         : false,
            elements     : [],
            window_height: 0
        };

        self.config = {
            load: 1.9
        };

        self.resizeTimeout = false;

        self.add = function ($element) {
            if ($element.closest('[data-on_demand="false"]').length) {
                return;
            }

            $element.attr('data-on_demand', 'waiting');

            var use_parent = false;
            var $parent    = false;

            if (typeof $element.attr('data-object_fit') != 'undefined') {
                $parent    = $element.parent();
                use_parent = $parent.length;
            }

            var top    = use_parent ? $parent.realOffset().top : $element.realOffset().top;
            var height = use_parent ? $parent.height() : $element.height();

            var element = {
                $         : $element,
                top       : top,
                bottom    : top + height,
                preloaded : false,
                loaded    : false,
                $parent   : $parent,
                use_parent: use_parent,
                type      : 'default',
                src       : $element.data('src'),
                visible   : $element.is(':visible')
            };


            if ($element.is('img')) {
                element.type = 'img';
            }

            if ($element.is('video')) {
                element.type = 'video';
                $element.attr('preload', 'none');
                $element.html('<source src="' + element.src + '" type="video/mp4"><source src="' + element.src.replace('.mp4', '.webm') + '" type="video/webm">');
                $element.removeAttr('data-src');
            }

            self.context.elements.push(element);

            self._load(element, $(window).scrollTop());
        };


        self._resize = function () {

            self.context.window_height = $(window).height();

            for (var i = 0; i < self.context.elements.length; i++) {
                var element    = self.context.elements[i];
                var top        = element.use_parent ? element.$parent.realOffset().top : element.$.realOffset().top;
                var height     = element.use_parent ? element.$parent.height() : element.$.height();

                element.top     = top;
                element.visible = element.$.is(':visible');
                element.bottom = top + height;
            }

            if (app && app.debug > 2) {
                console.log('on-demand', self.context.elements);
            }
        };


        self._loaded = function (element) {
            element.$.attr('data-on_demand', 'loaded');

            if ($.fn.fit) {
                element.$.fit(true);
            }

            element.loaded = true;

            clearTimeout(self.resizeTimeout);
            self.resizeTimeout = setTimeout(function () { $(window).resize() }, 100);

            self.applyPlayState(element, $(window).scrollTop());
        };


        self._load = function (element, scrollTop) {
            var targetScroll = scrollTop + self.context.window_height * self.config.load;

            if (!element.preloaded && element.visible && element.top <= targetScroll) {

                element.preloaded = true;

                element.$.attr('data-on_demand', 'loading');

                switch (element.type) {
                    case 'img':

                        (function (elem) {
                            elem.$
                                .on('load', function () { self._loaded(elem) })
                                .on('error', function () { elem.$.attr('data-on_demand', 'error') });

                        })(element);

                        element.$.attr('src', '');
                        element.$.attr('src', element.src);

                        break;

                    case "video" :

                        (function (elem) {
                            elem.$
                                .on('loadeddata', function () { self._loaded(elem) })
                                .on('ended', function () { elem.ended = true })
                                .on('error', function () { elem.$.attr('data-on_demand', 'error') });

                        })(element);

                        element.ended = false;
                        element.loop  = element.$.attr('loop') == "loop";
                        element.$.attr('preload', 'auto').attr('autoplay', false);

                        break;

                    default :

                        (function (elem) {
                            var $img = $('<img/>');

                            $img.on('load', function () { self._loaded(elem) })
                                .on('error', function () { elem.$.attr('data-on_demand', 'error') });

                            $img.attr('src', elem.src);

                        })(element);

                        element.$.css('background-image', "url('" + element.src + "')");

                        break;
                }

                element.$.removeAttr('data-src');
            }

            self.applyPlayState(element, scrollTop);
        };


        self.applyPlayState = function (element, scrollTop) {
            if (element.type == "video" && element.loaded) {
                if (element.top < scrollTop + self.context.window_height && element.bottom > scrollTop) {
                    if (!element.play && (element.loop || !element.ended)) {
                        element.$.attr('data-state', 'playing');
                        element.$.get(0).play();
                        element.play = true;
                    }
                }
                else if (element.play) {
                    element.$.attr('data-state', 'paused');
                    element.$.get(0).pause();
                    element.play = false;
                }
            }

        };


        self._loadAll = function () {
            var scrollTop = $(window).scrollTop();

            for (var i in self.context.elements) {
                var element = self.context.elements[i];
                self._load(element, scrollTop);
            }
        };


        /* Contructor. */

        /**
         *
         */
        self.__construct = function () {
            $('[data-src]').initialize(function () {
                self.add($(this))
            });

            var resize = function () {
                self._resize();
                self._loadAll();
            };

            $(window).on('scroll', self._loadAll).on('resize', resize);

            $(document).on('loaded', function () {

                self._resize();
                setTimeout(self._loadAll, 300);
            });
        };


        if (typeof dom !== "undefined") {
            dom.compiler.register('attribute', 'on-demand', function (elem, attrs) {
                var src = elem.attr('src');

                if (elem.is('img') && typeof elem.attr('src') == 'undefined') {
                    elem.attr('src', "{{ blank() }}");
                }

                elem.attr('data-src', attrs.onDemand.length ? attrs.onDemand : src);

            }, self.add);
        }


        /* Public */
        self.__construct();
    };

    rocket          = typeof rocket == 'undefined' ? {} : rocket;
    rocket.onDemand = new OnDemand();

})(jQuery);

