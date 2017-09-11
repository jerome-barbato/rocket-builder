/**
 * On Top
 *
 * Copyright (c) 2017 - Metabolism
 * Author:
 *   - Jérome Barbato <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 2.0
 *
 *
 * Requires:
 *   - jQuery
 *
 **/
(function ($) {

    var Detect = function () {
        var self = this;

        self.context = {
            init           : false,
            elements       : [],
            $window        : $(window),
            $body          : false,
            window_height  : 0,
            document_height: 0,
            offset         : {
                top   : 0,
                bottom: 0
            },
            top_reached    : false,
            bottom_reached : false,
            in_between     : false
        };


        self.add = function ($element) {
            if (!$element || !$element.length) {
                return;
            }

            var element = {
                $       : $element,
                detect  : typeof $element.data('detect') != 'undefined' ? $element.data('detect') : 'on-top',
                top     : $element.realOffset().top,
                detected: false
            };

            element.bottom = element.top + $element.outerHeight();

            self.context.elements.push(element);

            self._detect();
        };


        self._resize = function () {

            if( !self.context.$body )
                return;

            for (var i = 0; i < self.context.elements.length; i++) {
                var element = self.context.elements[i];

                if (!element.detected) {
                    element.top    = element.$.realOffset().top;
                    element.bottom = element.top + element.$.outerHeight();
                }
            }

            if (app && app.debug > 2) {
                console.log('detect', self.context.elements);
            }

            self.context.window_height   = $(self.context.$window).height();
            self.context.document_height = $(document).height();

            self._computeOffset();
            self._detect();
        };


        self._computeOffset = function () {

            self.context.offset.body   = !isNaN(self.context.$body.data('scroll_offset'))?self.context.$body.data('scroll_offset'):5;
            self.context.offset.top    = $('[data-fixed="top"]').height();
            self.context.offset.bottom = $('[data-fixed="bottom"]').height();
        };


        self._detectScrollBoundReached = function (scroll_top) {
            if (!self.context.document_height || !self.context.window_height) {
                return;
            }

            if (scroll_top <= self.context.offset.body) {
                if (!self.context.top_reached) {
                    self.context.top_reached = true;
                    self.context.in_between  = self.context.bottom_reached = false;

                    self.context.$body.removeClass('has-scrolled').attr('data-scroll', 'top');
                    self.context.$body.trigger('scroll.top');
                }
            }
            else if (scroll_top >  self.context.offset.body && scroll_top + self.context.window_height < self.context.document_height) {
                if (!self.context.in_between) {
                    self.context.bottom_reached = self.context.top_reached = false;
                    self.context.in_between = true;

                    self.context.$body.addClass('has-scrolled').attr('data-scroll', 'between');
                    self.context.$body.trigger('scroll.between');
                }
            }
            else if (scroll_top + self.context.window_height >= self.context.document_height) {
                if (!self.context.bottom_reached) {
                    self.context.top_reached = self.context.in_between = false;
                    self.context.bottom_reached = true;

                    self.context.$body.attr('data-scroll', 'bottom');
                    self.context.$body.trigger('scroll.bottom');
                }
            }
        };


        self._detect = function () {

            var scrollTop = self.context.$window.scrollTop();

            self._detectScrollBoundReached(scrollTop);

            for (var i = 0; i < self.context.elements.length; i++) {
                var element = self.context.elements[i];
                var test            = -1;
                var classprefix     = '';

                switch (element.detect) {
                    case 'on-top':

                        test = element.top <= scrollTop + self.context.offset.top;
                        classprefix = "is";
                        break;

                    case 'appear':

                        test = element.top <= scrollTop + self.context.window_height - self.context.offset.bottom;
                        classprefix = "has";
                        break;

                    case 'disappear':

                        test = element.bottom <= scrollTop + self.context.offset.top;
                        classprefix = "has";
                        break;

                    case 'visible':

                        test        = element.top <= scrollTop + self.context.window_height - self.context.offset.bottom && element.bottom >= scrollTop + self.context.offset.top;
                        classprefix = "is";
                        break;
                }

                if (test != -1) {
                    if (test) {
                        if (!element.detected) {
                            element.detected = true;
                            element.$.addClass(classprefix + '-' + element.detect);
                            element.$.trigger('detect.' + element.detect, [true]);
                        }
                    }
                    else {
                        if (element.detected) {
                            element.detected = false;
                            element.$.removeClass(classprefix + '-' + element.detect);
                            element.$.trigger('detect.' + element.detect, [false]);
                        }
                    }
                }
            }
        };

        /* Contructor. */

        /**
         *
         */
        self.__construct = function () {

            $('[data-detect]').initialize(function () {
                self.add($(this));
            });

            $(document).on('boot', function(){
	            self.context.$body = $('body');
	            self._resize();
            });

            self.context.$window
                .on('scroll', self._detect)
                .on('loaded', self._resize)
                .on('resize', self._resize);
        };


        if (typeof dom !== "undefined") {
            dom.compiler.register('attribute', 'detect', function (elem, attrs) {
                elem.attr('data-detect', attrs.detect);

            }, self.add);

            dom.compiler.register('attribute', 'fixed', function (elem, attrs) {
                elem.attr('data-fixed', attrs.fixed ? attrs.fixed : 'top');
            });
        }


        /* Public */
        self.__construct();
    };

    rocket        = typeof rocket == 'undefined' ? {} : rocket;
    rocket.detect = new Detect();

})(jQuery);
