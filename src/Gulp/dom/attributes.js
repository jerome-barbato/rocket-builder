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


    dom.compiler.register('attribute', 'sizer', function (elem, attrs)
    {
        var size = attrs.sizer.replace('/', 'x');

        if (elem.is('img'))
        {
            if (window.engine == 'twig')
                elem.attr('src', "{{ asset_url('/media/sizer/" + size + ".png') }}");
            else if (window.engine == 'smarty')
                elem.attr('src', "{asset_url file='/media/sizer/" + size + ".png'}");

            elem.addClass('has-sizer');

            if ('src' in attrs)
                elem.css('backgroundImage', "url('" + attrs.src + "')");
        }
        else
        {
            elem.attr('data-sizer', attrs.sizer);
        }
    });


    dom.compiler.register('attribute', 'background-color', function (elem, attrs)
    {
        if ('backgroundColor' in attrs && attrs.backgroundColor.length)
            elem.css("backgroundColor", attrs.backgroundColor);
    });


    dom.compiler.register('attribute', 'background', function (elem, attrs)
    {
        if ('background' in attrs && attrs.background.length)
            elem.css("backgroundImage", 'url("' + attrs.background + '")');
    });


    ['icon', 'component', 'tmp', 'misc'].map(function (type)
    {
        dom.compiler.register('attribute', type + '-src', function (elem, attrs)
        {
            if (window.engine == 'twig')
            {
                var src = attrs[type + 'Src'].replace('{{', '\' ~ ').replace('}}', ' ~ \'');
                elem.attr('src', "{{ asset_url('/media/" + type + "/" + src + "') }}");
            }
            else if (window.engine == 'smarty')
            {
                var src = attrs[type + 'Src'];
                elem.attr('style', 'background-image:url({asset_url file="/media/' + type + '/' + src + '"})');
            }
        });

        dom.compiler.register('attribute', type + '-background', function (elem, attrs)
        {
            if (window.engine == 'twig')
            {
                var src = attrs[type + 'Background'].replace('{{', '\' ~ ').replace('}}', ' ~ \'');
                elem.attr('style', "background-image:url({{ asset_url('/media/" + type + "/" + src + "') }})");
            }
            else if (window.engine == 'smarty')
            {
                var src = attrs[type + 'Background'];
                elem.attr('style', "background-image:url('{asset_url file='/media/" + type + "/" + src + "'}')");
            }
        });
    });


    dom.compiler.register('attribute', 'vcenter', function (elem) {

        if (elem.is('div') || elem.is('header') || elem.is('article') || elem.is('footer') || elem.is('main')) {
            elem.wrapInner('<div class="valign"><div class="valign__middle"></div></div>');
        } else {
            elem.wrapInner('<span class="valign"><span class="valign__middle"></span></span>');
        }
    });


	dom.compiler.register('attribute', 'defer', function (elem, attrs) {

		if (elem.is('img')) {

            if (typeof elem.attr('src') == 'undefined')
                elem.attr('src', "{{ blank() }}");

			if (attrs.defer)
				dom.compiler.attr(elem, 'src', attrs.defer);
		}
	});

})(jQuery);
