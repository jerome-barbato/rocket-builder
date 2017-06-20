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
        {
            elem.addClass('text text--' + attrs.text);
            console.log('attribute text is not recommended, please use @include text('+attrs.text+') instead');
        }
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


    ['block', 'icon', 'page', 'component', 'tmp', 'misc'].map(function (type)
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

})(jQuery);
