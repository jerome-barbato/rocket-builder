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

        var self  = this;

        self.type = false;

        self.page = function (url, title)
        {
            if (typeof url != 'undefined' && url.length)
            {
	            if (typeof title == 'undefined' )
		            title = '';

                if ( self.type == 'ga' )
                {
                    if (app && app.debug > 2)
                        console.log('ga', 'send', 'pageview', url);

                    ga('send', 'pageview', url);
                }
                else if ( self.type == 'gtm' )
                {
	                if (app && app.debug > 2)
		                console.log('gtm', 'send', 'pageview', url);

	                window.dataLayer.push({
		                'event':'VirtualPageview',
		                'virtualPageURL': url,
		                'virtualPageTitle' : title
	                });
                }
            }
        };


        self.event = function (category, action, label) {

            if (typeof label == 'undefined')
                label = '';

            if (typeof category != 'undefined' && typeof action != 'undefined') {

                if ( self.type == 'ga' )
                {
                    if (app && app.debug > 2)
                        console.log('ga', 'send', 'event', category, action, label);

                    ga('send', 'event', category, action, label);
                }
                else if( self.type == 'gtm'){

	                if (app && app.debug > 2)
		                console.log('gtm', 'event', category, action, label);

	                window.dataLayer.push({
		                'event' : 'uaevent',
		                'eventCategory': category,
		                'eventAction': action,
		                'eventLabel': label
	                });
                }
            }
        };


        /* Constructor. */

        self.__construct = function ()
        {
            if( 'dataLayer' in window )
                self.type = 'gtm';
            else if( typeof ga != 'undefined')
	            self.type = 'ga';
            else
                return;

            $(document).on('click', '[data-tag]', function ()
            {
                var data = $(this).data('tag').split('|');

                if (data.length == 2)
                    self.event(data[0], data[1]);
                else if (data.length == 3)
                    self.event(data[0], data[1], data[2]);
            });
        };

        if (typeof dom !== 'undefined') {
            dom.compiler.register('attribute', 'tag', function (elem, attrs) {
                elem.attr('data-tag', attrs.tag);
            });
        }


        self.__construct();
    };

    rocket     = typeof rocket == 'undefined' ? {} : rocket;
    rocket.tag = new Tag();

})(jQuery);
