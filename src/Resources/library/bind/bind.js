/**
 * Bind
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

    var Bind = function () {

        var self = this;

        self.context = {
            $elements: []
        };

        self.config = {};


        self.add = function ($element) {
            var type    = $element.data('bind');
            var id      = $element.attr('href');
            var $target = $(id);

            if (!$target.length) {
                return;
            }

            if (type == 'click') {
                self._handleClick(id, $element, $target);
            } else if (type == 'hover') {
                self._handleHover(id, $element, $target);
            }
        };


        self._handleHover = function (id, $element, $target) {

            $element.add($target).hover(function () {

                    $element.addClass('is-active');
                    $target.addClass('is-active');
                },
                function () {

                    $element.removeClass('is-active');
                    $target.removeClass('is-active');
                });
        };


        self._handleClick = function (id, $element, $target) {

            $element.click(function (e) {
                e.preventDefault();

                $element.toggleClass('is-active');
                $target.toggleClass('is-active');
            });

            $(document).click(function (e) {
                var $click_target = $(e.target);

                if ($element.hasClass('is-active') && !$click_target.closest(id + ', [href="' + id + '"]').length) {
                    $element.removeClass('is-active');
                    $target.removeClass('is-active');
                }
            });
        };


        /* Constructor. */

        self.__construct = function () {
            $('[data-bind]').initialize(function () {
                self.add($(this));
            });
        };


        self.__construct();
    };

    rocket      = typeof rocket == 'undefined' ? {} : rocket;
    rocket.bind = new Bind();

})(jQuery);
