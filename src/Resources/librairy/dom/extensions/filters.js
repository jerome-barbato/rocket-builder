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

    dom.compiler.register('filter', 'width', function (elem, attrs)
    {
        if ('width' in attrs && attrs.width.indexOf('/') > -1)
        {
            var width = attrs.width.split('/');
            if (width.length == 2)
                elem.attr('width', Math.round(parseInt(width[0]) / parseInt(width[1])));
        }
    });


    dom.compiler.register('filter', 'height', function (elem, attrs)
    {
        if ('height' in attrs && attrs.height.indexOf('/') > -1)
        {
            var height = attrs.height.split('/');
            if (height.length == 2)
                elem.attr('height', Math.round(parseInt(height[0]) / parseInt(height[1])));
        }
    });

})(jQuery);
