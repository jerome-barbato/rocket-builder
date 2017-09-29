/**
 * Defer
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

    var Defer = function () {
        var self = this;

        self.resizeTimeout = false;

        self.resize = function () {
            clearTimeout(self.resizeTimeout);
            self.resizeTimeout = setTimeout(function () { $(window).resize() }, 100);
        };


        $(window).on('load', function () {
            $('[data-defer]').initialize(function () {
                var $element = $(this);

                $element
                    .on('load', self.resize)
                    .attr('src', $element.data('defer'))
                    .removeAttr('data-defer');

                if ($.fn.fit) {
                    $element.fit(true);
                }
            });
        });
    };

    rocket       = typeof rocket == 'undefined' ? {} : rocket;
    rocket.defer = new Defer();

})(jQuery);
