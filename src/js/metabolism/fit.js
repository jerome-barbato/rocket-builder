/**
 * Object fit polyfill
 *
 * Copyright (c) 2017 - Metabolism
 * Author:
 *   - Metabolism <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 1.2
 *
 * Requires:
 *   - jQuery
 *
 **/
(function ($) {


    var Fit = function () {

        var self = this;

        self.timeout = false;
        self.warn    = false;


        /* Public methods. */
        self.compute = function ($element) {

            if ($element.data('waiting')) return;

            var $container  = $element.parent();
            var container   = {
                width : $container.width(),
                height: $container.height()
            };
            container.ratio = container.width / container.height;

            self._getRatio($element, function (element_ratio) {

                var object_position = $element.hasDataAttr('object_position') ? $element.data('object_position') : 'center center';
                object_position     = object_position.split(' ');

                if (object_position.length == 1) {
                    object_position.push('center');
                }

                var position = {
                    width : '',
                    height: '',
                    top   : 'auto',
                    left  : 'auto',
                    right : 'auto',
                    bottom: 'auto'
                };

                if ($element.data('object_fit') == "contain") {

                    if (element_ratio < container.ratio) {

                        position.width  = Math.round(container.height * element_ratio);
                        position.height = container.height;
                    }
                    else {

                        position.height = Math.round(container.width / element_ratio);
                        position.width  = container.width;
                    }

                } else {

                    if (element_ratio > container.ratio) {

                        position.width  = Math.round(container.height * element_ratio);
                        position.height = container.height;
                    }
                    else {

                        position.height = Math.round(container.width / element_ratio);
                        position.width  = container.width;
                    }
                }

                container = {
                    width : $container.outerWidth(),
                    height: $container.outerHeight()
                };

                if (object_position[0] == 'left' || object_position[1] == 'left') {
                    position.left = 0;
                } else if (object_position[0] == 'right' || object_position[1] == 'right') {
                    position.right = 0;
                } else {
                    position.left = (container.width - position.width) / 2;
                }


                if (object_position[0] == 'top' || object_position[1] == 'top') {
                    position.top = 0;
                } else if (object_position[0] == 'bottom' || object_position[1] == 'bottom') {
                    position.bottom = 0;
                } else {
                    position.top = (container.height - position.height) / 2;
                }

                $element.css(position);
            });
        };


        /**
         *
         */
        self._add = function ($element) {

            if (Modernizr && Modernizr.objectfit) {
                return;
            }

            $element.data('waiting', false).parent().addClass('has-object-fit');

            if (!$element.data('ratio')) {

                self._getRatio($element, function () {

                    self.compute($element);
                });
            }
            else {
                self.compute($element);
            }

            $(document).on('loaded', function () { self.compute($element) });
            $(window).resize(function () { self.compute($element) });
        };


        self._getRatio = function ($element, callback) {

            if ($element.data('ratio')) {

                callback($element.data('ratio'));
                return;
            }

            var width  = parseInt($element.attr('width'));
            var height = parseInt($element.attr('height'));
            var ratio  = Math.round((width / height) * 100) / 100;

            if (isNaN(ratio)) {

                if (!self.warn) {

                    console.warn("there was a prb computing an image ratio, please be sure to specify width/height in the html to avoid resize on image loading");
                    self.warn = true;
                }

                var getNaturalDimensions = function () {

                    var width  = parseInt($element.naturalWidth());
                    var height = parseInt($element.naturalHeight());
                    var ratio  = Math.round((width / height) * 100) / 100;

                    $element.data('waiting', false);

                    if (!isNaN(ratio)) {

                        $element.attr('width', width).attr('height', height);
                        $element.data('ratio', ratio);

                        if (callback) {
                            callback(ratio);
                        }
                    }
                };

                if ($element.prop('complete')) {

                    getNaturalDimensions();
                }
                else {

                    $element.data('waiting', true);
                    $element.on('load', getNaturalDimensions);
                }
            }
            else {

                $element.data('ratio', ratio);

                if (callback) {
                    callback(ratio);
                }
            }
        };


        self.__construct = function () {

            $('[data-object_fit]').initialize(function () {

                self._add($(this));
            });
        };


        if (typeof dom !== "undefined") {

            dom.compiler.register('attribute', 'object-fit', function (elem, attrs) {

                elem.attr('data-object_fit', attrs.objectFit.length ? attrs.objectFit : 'cover');

                if ('objectPosition' in attrs) {

                    elem.attr('data-object_position', attrs.objectPosition);
                    elem.removeAttr('object-position', attrs.objectPosition);
                }

            }, self._add);
        }


        /*
         * jQuery extension
         *
         * ex: $('.class').fit();
         */

        if (typeof $ != 'undefined') {

            $.fn.fit = function (recompute_ratio) {

                if (!$(this).hasDataAttr('object_fit') || (Modernizr && Modernizr.objectfit)) {
                    return;
                }

                if (typeof recompute_ratio == "undefined") {
                    recompute_ratio = false;
                }

                $(this).each(function () {

                    if (recompute_ratio) {
                        $(this).data('ratio', false);
                    }

                    meta.fit.compute($(this))
                });
            };
        }

        self.__construct();
    };

    rocket     = typeof rocket == 'undefined' ? {} : rocket;
    rocket.fit = new Fit();

})(jQuery);

