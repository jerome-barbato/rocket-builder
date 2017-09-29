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
            return '<iframe data-src="' + url + '" allowfullscreen class="youtube-embed meta-defer"></iframe>';
        } else {
            return '<iframe src="' + url + '" allowfullscreen class="youtube-embed"></iframe>';
        }
    });


    dom.compiler.register('element', 'vtop', function (elem) {

        var $parent = elem.parent();

        if ($parent.is('a') || $parent.is('span')) {
            return '<span class="valign"><span class="valign__top"><transclude/></span></span>';
        } else {
            return '<div class="valign"><div class="valign__top"><transclude/></div></div>';
        }
    });


    dom.compiler.register('element', 'vbottom', function (elem) {

        var $parent = elem.parent();

        if ($parent.is('a') || $parent.is('span')) {
            return '<span class="valign"><span class="valign__bottom"><transclude/></span></span>';
        } else {
            return '<div class="valign"><div class="valign__bottom"><transclude/></div></div>';
        }
    });

	dom.compiler.register('element', 'grid', function(elem, attrs) {

		if( 'mod' in attrs && !'element' in attrs && !'block' in attrs )
			elem.removeAttr('mod');

		return '<div data-grid="'+(attrs.mod?attrs.mod:'')+'"><transclude/></div>';
	});


	dom.compiler.register('element', 'row', function(elem, attrs) {

		if( 'mod' in attrs && !'element' in attrs && !'block' in attrs )
			elem.removeAttr('mod');

		return '<div data-row="'+(attrs.mod?attrs.mod:'')+'"><transclude/></div>';
	});


	dom.compiler.register('element', 'column', function(elem, attrs) {

		var attributes = ['data-col="'+(attrs.size?attrs.size:'1/1')+'"'];

		if( attrs.size )
			elem.removeAttr('size');

		if( 'mod' in attrs && !'element' in attrs && !'block' in attrs ){

			attributes.push('data-align="'+attrs.mod+'"');
			elem.removeAttr('mod');
		}

		if( 'offsetBy' in attrs ){

			$('<div data-col="'+attrs.offsetBy+'"></div>').insertBefore(elem);
			elem.removeAttr('offset-by');
		}

		$.each(grid_breakpoints, function(i, media){

			var c_media = camelCase('size-'+media);
			if (attrs[c_media]) {

				attributes.push('data-col-' + media + '="' + attrs[c_media] + '"');
				elem.removeAttr('size-' + media);
			}
		});

		return '<div '+attributes.join(' ')+'><transclude/></div>';
	});

})(jQuery);
