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


    dom.compiler.register('attribute', 'keep', function (elem, attrs)
    {
        elem.attr('data-keep', 'true');
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


    dom.compiler.register('attribute', 'icon', function (elem, attrs)
    {
        if ('icon' in attrs && attrs.icon.length)
            elem.attr('data-icon', attrs.icon);
    });


    dom.compiler.register('attribute', 'icon-after', function (elem, attrs)
    {
        if ('iconAfter' in attrs && attrs.iconAfter.length)
            elem.attr('data-icon-after', attrs.iconAfter);
    });


    dom.compiler.register('attribute', 'icon-before', function (elem, attrs)
    {
        if ('iconBefore' in attrs && attrs.iconBefore.length)
            elem.attr('data-icon', attrs.iconBefore);
    });


    dom.compiler.register('attribute', 'text', function (elem, attrs)
    {
        if ('text' in attrs && attrs.text.length)
            elem.addClass('text text--' + attrs.text);
    });


    dom.compiler.register('attribute', 'button', function (elem, attrs)
    {
        if ('button' in attrs && attrs.button.length)
            elem.addClass('button button--' + attrs.button);
    });


    dom.compiler.register('attribute', 'align', function (elem, attrs)
    {
        if ('align' in attrs && attrs.align.length)
            elem.addClass('align-' + attrs.align);
    });


    dom.compiler.register('attribute', 'hide-on', function (elem, attrs)
    {
        if ('hideOn' in attrs && attrs.hideOn.length)
            elem.attr('data-hide_on', attrs.hideOn);
    });


    dom.compiler.register('attribute', 'show-on', function (elem, attrs)
    {
        if ('showOn' in attrs && attrs.showOn.length)
                elem.attr('data-show_on', attrs.showOn);
    });


    ['block', 'icon', 'page', 'component', 'tmp', 'misc', 'shared'].map(function (type)
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


    dom.compiler.register('attribute', 'when-visible', function (elem, attrs) {
        elem.attr('data-activation', attrs.whenVisible);

        if (attrs.whenVisible == 'stack') {
            elem.find('[delay],[data-delay]')
                .not('[animation],[data-animation]')
                .attr('data-animation', 'slide-up');
        }

        if (attrs.whenVisible == 'reveal' && elem.is('img')) {
            console.log('Reveal animation on image require to wrap the image inside a span');
        }

    });


    dom.compiler.register('attribute', 'activate', function (elem, attrs) {
        elem.attr('data-activation', 'wait');
    });


    dom.compiler.register('attribute', 'delay', function (elem, attrs) {
        elem.attr('data-delay', attrs.delay);
    });


    dom.compiler.register('attribute', 'easing', function (elem, attrs) {
        if (attrs.easing != "in-out-cubic") {
            elem.attr('data-easing', attrs.easing);
        }
    });


    dom.compiler.register('attribute', 'visibility', function (elem, attrs) {

        var visibility = attrs.visibility.replace('%', '');

        if (visibility == "top") {
            visibility = 1;
        }

        if (visibility == "half") {
            visibility = 0.5;
        }

        if (visibility == "bottom") {
            visibility = 0;
        }

        elem.attr('data-visibility', attrs.visibility.indexOf('%') >= 0 ? parseInt(visibility) / 100 : visibility);
    });


    dom.compiler.register('attribute', 'animation', function (elem, attrs) {

        elem.attr('data-animation', attrs.animation);

        if (attrs.animation == 'stack') {
            elem.find('[delay],[data-delay]')
                .not('[animation],[data-animation]')
                .attr('data-animation', 'slide-up');
        }
    });


	dom.compiler.register('attribute', 'controller', function (elem, attrs)
	{
		elem.attr('data-controller', attrs.controller);
	});


	dom.compiler.register('attribute', 'remove-on', function (elem, attrs)
	{
		elem.attr('data-remove_on', attrs.removeOn);
	});


	dom.compiler.register('attribute', 'if', function (elem, attrs)
	{
		if ('if' in attrs)
			elem.attr('data-if', attrs['if']);
	});


	dom.compiler.register('attribute', 'if-not', function (elem, attrs)
	{
		if ('ifNot' in attrs)
			elem.attr('data-if-not', attrs.ifNot);
	});


	dom.compiler.register('attribute', 'bind', function (elem, attrs) {
		elem.attr('data-bind', attrs.bind);

	});


	dom.compiler.register('attribute', 'custom', function(elem, attrs)
	{
		elem.attr('data-custom', attrs.custom.length ? attrs.custom : 'true');

		if( attrs.placeholder )
		{
			elem.attr('data-placeholder', attrs.placeholder);
			elem.removeAttr('placeholder');
		}
	});


	dom.compiler.register('attribute', 'defer', function (elem, attrs) {
		if (elem.is('img')) {
			if (window.precompile) {

				if (typeof elem.attr('src') == 'undefined') {
					elem.attr('src', "{{ blank() }}");
				}
			}

			if (attrs.defer) {
				dom.compiler.attr(elem, 'defer', attrs.defer);
			}
		}
	});


	dom.compiler.register('attribute', 'detect', function (elem, attrs) {
		elem.attr('data-detect', attrs.detect);

	}, self.add);


	dom.compiler.register('attribute', 'fixed', function (elem, attrs) {
		elem.attr('data-fixed', attrs.fixed ? attrs.fixed : 'top');
	});


	dom.compiler.register('attribute', 'object-fit', function(elem, attrs) {

		elem.attr('data-object_fit', attrs.objectFit.length ? attrs.objectFit : 'cover');

		if( 'objectPosition' in attrs ){

			elem.attr('data-object_position', attrs.objectPosition);
			elem.removeAttr('object-position', attrs.objectPosition);
		}
	});


	dom.compiler.register('attribute', 'grid', function(elem, attrs) {

		elem.attr('data-grid', attrs.grid?attrs.grid:'');
	});


	dom.compiler.register('attribute', 'row', function(elem, attrs) {

		elem.attr('data-row' ,attrs.row?attrs.row:'');
	});


	dom.compiler.register('attribute', 'col', function(elem, attrs) {

		elem.attr('data-col', attrs.col?attrs.col:'');

		if( attrs.offsetBy ){

			$('<div data-col="'+attrs.offsetBy+'"></div>').insertBefore(elem);
			elem.removeAttr('offset-by');
		}

		$.each(grid_breakpoints, function(i, media){

			var c_media = camelCase('col-'+media);

			if( attrs[c_media] ){

				elem.attr('data-col-'+media, attrs[c_media]);
				elem.removeAttr('col-'+media);
			}
		});
	});


	dom.compiler.register('attribute', 'mailto', function (elem, attrs) {

		var mail = attrs.mailto.indexOf('@') >= 0 ? attrs.mailto.split('@') : attrs.mailto.split('|');

		elem.attr('data-name', mail[0]);
		elem.attr('data-domain', mail[1]);
	});


	dom.compiler.register('attribute', 'on-demand', function (elem, attrs)
	{
		var src = elem.attr('src');

		if (elem.is('img') && typeof elem.attr('src') === 'undefined')
			elem.attr('src', "{{ blank() }}");

		elem.attr('data-src', attrs.onDemand.length ? attrs.onDemand : src);

	});


	dom.compiler.register('attribute', 'parallax-container', function (elem, attrs) {

		elem.addClass('parallax-container');
	});


	dom.compiler.register('attribute', 'parallax', function (elem, attrs) {

		if (elem.hasDataAttr('animation')) {

			console.warn('Parallax and animation are not compatible, please add an extra node ( parallax : "' + attrs.parallax + '", animation : "' + elem.data('animation') + '")');
			return;
		}

		dom.compiler.attr(elem, 'parallax', attrs.parallax);

		if ('parallaxCenter' in attrs) {

			dom.compiler.attr(elem, 'parallax-center', attrs.parallaxCenter == "1" || attrs.parallaxCenter == "true" ? "1" : "0");
			elem.removeAttr('parallax-center');
		}

		if ('parallaxGap' in attrs) {

			dom.compiler.attr(elem, 'parallax-gap', attrs.parallaxGap == "1" || attrs.parallaxGap == "true" ? "1" : "0");
			elem.removeAttr('parallax-gap');
		}
	});


	dom.compiler.register('attribute', 'popin', function (elem, attrs)
	{
		elem.attr('data-popin', attrs.popin);

		if (attrs.context)
		{
			elem.attr('data-context', attrs.context);
			elem.removeAttr('context');
		}
	});


	dom.compiler.register('attribute', 'page', function (elem, attrs) {

		var $parent = elem.parents('[data-page]');
		elem.attr('data-page', $parent.length ? $parent.data('page') + '/' + attrs.page : attrs.page);

		if (typeof attrs.default !== "undefined") {
			elem.attr('data-default', 'true');
			elem.removeAttr('default');
		}
	});


	dom.compiler.register('attribute', 'scroll-to', function (elem, attrs) {

		if ('scrollTo' in attrs && attrs.scrollTo.indexOf('http') != -1)
			elem.attr('href', attrs.scrollTo);
		 else
			elem.attr('href', '#/' + attrs.scrollTo);
	});


	dom.compiler.register('attribute', 'fixed', function (elem, attrs) {

		elem.attr('data-fixed', attrs.fixed ? attrs.fixed : 'top');
	});


	dom.compiler.register('attribute', 'share-on', function (elem, attrs) {

		elem.attr('data-share_on', attrs.shareOn);
	});


	dom.compiler.register('element', 'slider', function (elem, attrs)
	{
		return '<div class="swiper-container"><transclude/></div>';

	});


	dom.compiler.register('element', 'slides', function (elem)
	{
		return '<div class="swiper-wrapper"><transclude/></div>';
	});


	dom.compiler.register('element', 'slide', function (elem)
	{
		return '<div class="swiper-slide" data-on_demand="false"><transclude/></div>';
	});


	dom.compiler.register('attribute', 'slide-item', function (elem, attrs)
	{
		elem.addClass('swiper-slide__item');
	});


	dom.compiler.register('element', 'arrows', function (elem)
	{
		return '<a class="swiper-button-next"></a><a class="swiper-button-prev"></a>';
	});


	dom.compiler.register('element', 'pagination', function (elem)
	{
		return '<div class="swiper-pagination"><transclude/></div>';
	});


	dom.compiler.register('attribute', 'tabs', function (elem)
	{
		elem.attr('data-tabs', 'true');
	});


	dom.compiler.register('attribute', 'tag', function (elem, attrs) {
		elem.attr('data-tag', attrs.tag);
	});


	dom.compiler.register('attribute', 'timeline', function (elem, attrs) {

		elem.attr('data-timeline', attrs.timeline);

		if (attrs.startAt) {
			elem.attr('data-start_at', attrs.startAt ? attrs.startAt : 0);
		}

		if (attrs.endAt) {
			elem.attr('data-end_at', attrs.endAt);
		}

		if (attrs.timeScale) {
			elem.attr('data-time_scale', attrs.timeScale);
		}

		if (attrs.debug) {
			elem.attr('data-debug', 'true');
		}
	});


	dom.compiler.register('attribute', 'toggles', function (elem, attrs)
	{
		console.log('toggles is deprecated, replace with toggle');
		elem.attr('data-toggle', attrs.toggles.length ? attrs.toggles : 'link');

	});


	dom.compiler.register('attribute', 'toggle', function (elem, attrs)
	{
		elem.attr('data-toggle', attrs.toggle.length ? attrs.toggle : 'link');

	});

})(jQuery);
