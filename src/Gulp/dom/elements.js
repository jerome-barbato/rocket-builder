/**
 * DOM Extensions
 *
 * Copyright (c) 2016 - Metabolism
 * Author:
 *   - Jérome Barbato <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 3
 *
 * Requires:
 *   - jQuery
 *
 **/

(function ($) {

    if (typeof dom == 'undefined' || !'compiler' in dom)
        return;


    dom.compiler.register('element', 'vcenter', function (elem) {

        var $parent = elem.parent();

        if ( !$parent.length || $parent.is('div') || $parent.is('header') || $parent.is('article') || $parent.is('footer') || $parent.is('main'))
            return '<div class="valign"><div class="valign__middle"><transclude/></div></div>';
        else
            return '<span class="valign"><span class="valign__middle"><transclude/></span></span>';
    });


    dom.compiler.register('element', 'youtube-embed', function (elem, attrs) {

        var options = {

            defer         : 0,
            autoplay      : 0,
            autohide      : 2,
            color         : 'red',
            modestbranding: 1,
            rel           : 0,
            showinfo      : 0,
            loop          : 0,
            theme         : 'light',
            hl            : 'en',
            controls      : 1,
            enablejsapi   : 0
        };

        $.each(options, function (index) {

            if (typeof attrs[index] !== "undefined") {
                options[index] = attrs[index];
            }
        });

        if (options.loop) {
            options.playlist = attrs.id;
        }

        var url = 'https://www.youtube.com/embed/' + attrs.id + '?' + $.param(options);
        url     = url.replace(/%7B/g, '{').replace(/%7D/g, '}');

        if (options.defer) {
            return '<iframe src="" data-src="' + url + '" allowfullscreen class="youtube-embed"></iframe>';
        } else {
            return '<iframe src="' + url + '" allowfullscreen class="youtube-embed"></iframe>';
        }
    });

})(jQuery);
