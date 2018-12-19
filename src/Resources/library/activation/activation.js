/**
 * Activation
 *
 * Copyright (c) 2016 - Metabolism
 * Author:
 *   - Jérome Barbato <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 4.1
 *
 * Requires:
 *   - jQuery
 *
 **/

(function ($) {

    var Activation = function () {

        var self = this;


        /* Public */

        self.context = {
            hold         : false,
            window_height: 0,
            elements     : [],
            lang         : $('html').attr('lang'),
            animationEnd : 'animationend.meta-activation oanimationend.meta-activation webkitAnimationEnd.meta-activation MSAnimationEnd.meta-activation'
        };


        self.config = {
            visibility: 0.2,
            reverse   : true,
            mobile    : $('meta[name="animation-mobile"]').attr('content') == "yes"
        };


        self.add = function ($element) {
            if (!$element || !$element.length) {
                return;
            }

            var element = self._add($element);

            self._activate(element);
        };


        /* Private. */

        self._init = function () {

            if (Modernizr && Modernizr.csstransitions) {
                self._scroll();
            }
        };


        self._onAnimationEnded = function ($element, callback) {
            var $items = $element.find('[data-animation]');

            if ($items.length) {
                var i = 0;

                $items.one(self.context.animationEnd, function () {
                    i++;

                    if (i == $items.length && callback) {
                        callback();
                    }
                });
            }
            else {
                $element.one(self.context.animationEnd, function () {
                    if (callback) {
                        callback();
                    }
                });
            }
        };


        self._add = function ($element) {
            if (self.context.disable) {
                $element.removeAttr('data-animation').removeAttr('data-easing').removeAttr('data-delay');
                $element.find('[data-animation]')
                        .removeAttr('data-animation')
                        .removeAttr('data-easing')
                        .removeAttr('data-delay');
            }
            else {
                var element = {
                    $         : $element,
                    top       : $element.offset().top,
                    visibility: parseFloat($element.data('visibility')) || self.config.visibility,
                    active    : false,
                    animation : $element.data('animation'),
                    delay     : $element.data('delay'),
                    increment : $element.data('animation') == 'increment'
                };

                var value = parseFloat(self.context.lang == 'fr' ? $element.text().replace(/,/, '.') : $element.text()
                                                                                                               .replace(/,/g, ''));

                if (element.increment && !isNaN(value)) {
                    var is_int = parseInt(value) === value;
                    var init   = is_int ? Math.round(value * 0.5) : Math.round(value * 5) / 10;

                    if (init < 50) {
                        init = 0;
                    }

                    $element.text(init);

                    element.value  = value;
                    element.is_int = is_int;
                    element.init   = init;
                }

                self.context.elements.push(element);

                return element;
            }

            return false;
        };


        self._setupEvents = function () {
            $(window)
                .scroll(self._scroll)
                .resize(self._recompute);
        };


        self._recompute = function () {
            self.context.window_height = $(window).height();

            $.each(self.context.elements, function (i, element) {
                element.top = element.$.offset().top;
            });

            self._scroll();
        };


        self._animateNumbers = function (from, to, element) {
            var unit_decimal  = self.context.lang == 'fr' ? ',' : '.';
            var unit_thousand = self.context.lang == 'fr' ? ' ' : ',';

            $({increment: from}).stop(true).animate({increment: to}, {
                duration: 1500,
                easing  : "easeOutCubic",
                step    : function () {
                    var value = element.is_int ?
                        Math.round(this.increment).format(0).replace(/ /g, unit_thousand) :
                        (Math.round(this.increment * 10) / 10).format(1).replace('.', unit_decimal);

                    element.$.text(value);
                },
                complete: function () {
                    element.$.text(element.is_int ? to.format(0).replace(/ /g, unit_thousand) : to.format(1)
                                                                                                  .replace('.', unit_decimal));
                    element.$.trigger('animationend');
                }
            });
        };


        self._reset = function (element) {
            self._onAnimationEnded(element.$, function () {
                element.$.attr('data-activation', 'wait');
            });

            element.$.attr('data-animation', element.animation).attr('data-activation', 'rewind');
            element.active = false;

            if (element.increment) {
                self._animateNumbers(element.value, element.init, element);
            }
        };


        self._activate = function (element, scrollTop) {
            if (!element) {
                return;
            }

            if (typeof scrollTop == "undefined") {
                scrollTop = $(window).scrollTop() + self.context.window_height;
            }

            if (element.active) {
                if (self.config.reverse && element.top + self.context.window_height * element.visibility > scrollTop) {
                    self._reset(element);
                }
            }
            else {
                if (scrollTop > element.top + self.context.window_height * element.visibility) {
                    self._onAnimationEnded(element.$, function () {
                        element.$.attr('data-activation', 'played');
                    });

                    element.$.attr('data-activation', 'play');

                    element.active = true;

                    if (element.increment) {
                        self._animateNumbers(element.init, element.value, element);
                    }
                }
            }
        };

        self._scroll = function () {

            if (self.context.hold) return;

            var scrollTop = $(window).scrollTop() + self.context.window_height;

            $.each(self.context.elements, function (index, element) {
                self._activate(element, scrollTop);
            });
        };


        /* Constructor. */

        /**
         *
         */
        self.__construct = function () {

            self.context.disable = browser && browser.mobile && !self.config.mobile;

            if (self.context.disable) {

                $('[data-activation]').initialize(function () {
                    $(this).removeAttr('data-activation');
                });

                $('[data-animation]').initialize(function () {
                    if (typeof( $(this).attr('data-keep') ) == 'undefined' && !$(this).closest('[data-keep]').length) {
                        $(this).removeAttr('data-animation').removeAttr('data-delay');
                    }
                });

                $('html').addClass('no-activation');
            }
            else {

                $('html').addClass('activation');

                $('[data-activation]').initialize(function () {
                    var $elem = $(this);

                    $elem.attr('data-animation', $elem.data('activation'));
                    $elem.attr('data-activation', 'wait');
                    self.add($elem);
                });

                $('[data-animation="reveal"]').initialize(function () {
                    var $children = $(this).find('*');

                    if (!$children.length) {
                        $(this).wrapInner('<span/>');
                    } else if ($children.length > 2) {
                        $(this).wrapInner('<div/>');
                    }
                });

                $(window).on('load', function () {
                    self._setupEvents();
                    self._recompute();
                });
            }
        };

        self.__construct();
    };

    rocket            = typeof rocket == 'undefined' ? {} : rocket;
    rocket.activation = new Activation();

})(jQuery);
