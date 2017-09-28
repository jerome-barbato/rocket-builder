/**
 * Scroll
 *
 * Copyright (c) 2017 - Metabolism
 * Author:
 *   - Jérome Barbato <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 1.0
 *
 * Changelog
 *
 * Requires:
 *   - jQuery
 *
 **/

(function ($) {


    var Scroll = function () {

        var self = this;

        self.config = {
            speed       : 600,
            offset      : 0,
            force_offset: false
        };

        self.targets    = [];
        self.offset     = 0;
        self.scroll_top = 0;


        self._setupEvents = function () {
            $(window).scroll(self._setActive).resize(self._resize);
        };


        self.scrollTo = function (id, animate, duration) {
            var target = 0;

            if ($(id).length) {
                target = $(id).realOffset().top;
            } else if (id == "#top") {
                target = 0;
            } else if (id == "#next") {
                target = $(window).height();
            } else {
                return;
            }

            var scroll_to = target - self._computeOffset();

            if (animate) {
                if (typeof duration == 'undefined' || !duration) {
                    var scroll_diff = Math.abs(self.scroll_top - scroll_to);
                    var velocity = Math.sqrt(scroll_diff / $(window).height());
                    duration     = Math.max(self.config.speed, velocity * self.config.speed);

                } else {
                    duration = parseInt(duration);
                }

                $('html, body').stop().animate({scrollTop: scroll_to}, duration, 'easeInOutCubic', function () {
                    $(document)
                        .trigger('meta-scroll', [
                            id,
                            target
                        ]);
                });
            }
            else {

                window.scrollTo(0, scroll_to);
            }
        };


        self._computeOffset = function () {
            if (self.config.force_offset) {
                self.offset = self.config.force_offset;
                return self.offset;
            }

            var $fixed = $('[data-fixed="top"]');

            if ($fixed.length) {

                self.offset = $fixed.outerHeight();
                return self.offset;
            }

            return 0;
        };


        self._setActive = function () {
            self.scroll_top = $(window).scrollTop() + self.offset;

            for (var i in self.targets) {
                var target = self.targets[i];

                if (target.top <= self.scroll_top) {
                    if (!target.seen) {
                        target.$link.addClass('seen');
                        target.$.addClass('seen');
                        target.seen = true;
                    }
                }
                else if (target.seen) {
                    target.$link.removeClass('seen');
                    target.$.removeClass('seen');
                    target.seen = false;
                }

                if (target.top <= self.scroll_top && target.bottom > self.scroll_top) {
                    if (!target.active) {
                        target.$link.addClass('is-active');
                        target.$.addClass('is-active');
                        target.active = true;
                    }
                }
                else if (target.active) {
                    target.$link.removeClass('is-active');
                    target.$.removeClass('is-active');
                    target.active = false;
                }
            }
        };


        self.add = function (elem) {
            var element = {
                anchor : elem.attr('href').replace('#/', '#'),
                $link  : elem,
                seen   : false,
                current: false
            };

            element.$ = $(element.anchor);

            if (element.$.length) {
                element.top    = element.$.realOffset().top;
                element.bottom = element.top + element.$.height();

                self.targets.push(element);
            }
        };


        self._resize = function () {
            for (var i = 0; i < self.targets.length; i++) {
                var target    = self.targets[i];

                target.top    = target.$.realOffset().top;
                target.bottom = target.top + target.$.height();
            }

            self._computeOffset();
            self._setActive();

            if (app && app.debug > 2) {
                console.log('scroll-to', self.targets);
            }
        };


        self._handleHash = function () {
            $(window).on('hashchange', function (e) {
                if (window.location.hash.indexOf('#/') !== -1 && window.location.hash.length) {
                    var id = window.location.hash.replace('#/', '#');
                    e.preventDefault();
                    
                    setTimeout(function () { self.scrollTo(id, true) });
                }
            })
        };


        /* Contructor. */

        /**
         *
         */
        self.__construct = function () {
            if (window.precompile) {
                return;
            }

            $('[href^="#/"]').initialize(function () {
                self.add($(this))
            });

            $(document).on('boot', function () { self._handleHash() });

            $(document).on('loaded', function () {
                self._computeOffset();
                self.scroll_top = self.offset;

                self._resize();

                $(window).trigger('hashchange');
            });

            self._setupEvents();
        };


        if (typeof dom !== "undefined") {
            dom.compiler.register('attribute', 'scroll-to', function (elem, attrs) {
                if (attrs.scrollTo.indexOf('http') != -1) {
                    elem.attr('href', attrs.scrollTo);
                } else {
                    elem.attr('href', '#/' + attrs.scrollTo);
                }
            });

            dom.compiler.register('attribute', 'fixed', function (elem, attrs) {
                elem.attr('data-fixed', attrs.fixed ? attrs.fixed : 'top');
            });
        }


        self.__construct();
    };

    rocket        = typeof rocket == 'undefined' ? {} : rocket;
    rocket.scroll = new Scroll();

})(jQuery);
