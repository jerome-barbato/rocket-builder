/**
 * Tagging
 *
 * Copyright (c) 2017 - Metabolism
 * Author:
 *   - Jérome Barbato <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 1.0
 *
 * Changelog
 * v1.0
 *
 * Requires:
 *   - jQuery
 *
 **/

(function ($) {

    var Tag = function () {
        var self = this;

        self.type = 'ga';


        self.page = function (url) {
            if (typeof url != 'undefined' && url.length) {
                if (self.type == 'ga') {
                    if (typeof ga != 'undefined') {
                        if (app && app.debug > 2) {
                            console.log('ga', 'send', 'pageview', url);
                        }

                        ga('send', 'pageview', url);

                    }
                    else {
                        if (app && app.debug) {
                            console.warn('ga is not yet defined');
                        }
                    }
                }
            }
        };


        self.event = function (category, action, label) {
            if (typeof label == 'undefined') {
                label = '';
            }

            if (typeof category != 'undefined' && typeof action != 'undefined') {
                if (self.type == 'ga') {
                    if (typeof ga != 'undefined') {
                        if (app && app.debug > 2) {
                            console.log('ga', 'send', 'event', category, action, label);
                        }

                        ga('send', 'event', category, action, label);
                    }
                    else {
                        if (app && app.debug) {
                            console.warn('ga is not yet defined');
                        }
                    }
                }
            }
        };


        /* Constructor. */

        self.__construct = function () {
            $(document).on('click', '[data-tag]', function () {
                var data = $(this).data('tag').split('|');

                if (data.length == 2) {
                    self.event(data[0], data[1]);
                } else if (data.length == 3) {
                    self.event(data[0], data[1], data[2]);
                }
            });
        };


        self.__construct();
    };

    rocket     = typeof rocket == 'undefined' ? {} : rocket;
    rocket.tag = new Tag();

})(jQuery);
