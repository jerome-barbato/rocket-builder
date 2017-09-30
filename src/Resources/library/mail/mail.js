/**
 * Mail
 *
 * Copyright (c) 2017 - Metabolism
 * Author:
 *   - Jérome Barbato <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 1.1
 *
 * Requires:
 *   - jQuery
 *
 **/
(function ($) {

    var Mail = function () {

        var self = this;

        /* Contructor. */

        self._resolve = function () {

            var email = $(this).data('name') + '@' + $(this).data('domain');

            $(this).attr('href', 'mailto:' + email);

            $(this).removeAttr('data-name').removeAttr('data-domain');

            if ($(this).text() == '@') {
                $(this).text(email);
            }
        };

        /**
         *
         */
        self.__construct = function () {

            $('[data-name][data-domain]').initialize(self._resolve);
        };


        $(document).ready( self.__construct);
    };

    rocket      = typeof rocket == 'undefined' ? {} : rocket;
    rocket.mail = new Mail();

})(jQuery);
