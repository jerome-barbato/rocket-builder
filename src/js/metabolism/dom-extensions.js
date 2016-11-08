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

var dom = dom || {};


dom.compiler.register('filter', 'width', function(elem, attrs){

    if( 'width' in attrs && attrs.width.indexOf('/') > -1 ){

        var width = attrs.width.split('/');
        if( width.length == 2 )
            elem.attr('width', Math.round(parseInt(width[0])/parseInt(width[1])));
    }
});



dom.compiler.register('filter', 'height', function(elem, attrs){

    if( 'height' in attrs && attrs.height.indexOf('/') > -1 ){

        var height = attrs.height.split('/');
        if( height.length == 2 )
            elem.attr('height', Math.round(parseInt(height[0])/parseInt(height[1])));
    }
});



dom.compiler.register('attribute', 'sizer', function(elem, attrs){

    var size = attrs.sizer.replace('/', 'x');

    if (window.precompile){

        if( elem.is('img') ){

            elem.attr('src', "{{ asset_url('/media/sizer/" + size + ".png') }}");
            elem.addClass('ux-sizer');
            elem.css('backgroundImage', "url('"+attrs.src+"')");
        }
        else
            elem.append('<img src="{{ asset_url(\'/media/sizer/' + size + '.png\') }}" class="ux-sizer">');
    }
    else if ( typeof app != "undefined" && 'asset' in app  ){

        if( elem.is('img') ){

            elem.attr('src', app.asset + '/media/sizer/' + size + '.png');
            elem.addClass('ux-sizer');
            elem.css('backgroundImage', "url('"+attrs.src+"')");
        }
        else
            elem.append('<img src="' + app.asset + '/media/sizer/' + size + '.png" class="ux-sizer">');
    }
});



dom.compiler.register('attribute', 'background-color', function(elem, attrs){

    if( 'backgroundColor' in attrs && attrs.backgroundColor.length )
        elem.css("backgroundColor" , attrs.backgroundColor);
});


dom.compiler.register('attribute', 'background', function(elem, attrs){

    if( 'background' in attrs && attrs.background.length )
        elem.css("backgroundImage" , 'url("'+attrs.background+'")');
});



dom.compiler.register('attribute', 'icon', function(elem, attrs){

    if( 'icon' in attrs && attrs.icon.length )
        elem.addClass('icon icon--'+attrs.icon);
});



dom.compiler.register('attribute', 'icon-after', function(elem, attrs){

    if( 'iconAfter' in attrs && attrs.iconAfter.length )
        elem.addClass('icon-after icon-after--'+attrs.iconAfter);
});



dom.compiler.register('attribute', 'icon-before', function(elem, attrs){

    if( 'iconBefore' in attrs && attrs.iconBefore.length )
        elem.addClass('icon icon--'+attrs.iconBefore);
});



dom.compiler.register('attribute', 'text', function(elem, attrs){

    if( 'text' in attrs && attrs.text.length )
        elem.addClass('text text--'+attrs.text);
});



dom.compiler.register('attribute', 'button', function(elem, attrs){

    if( 'button' in attrs && attrs.button.length )
        elem.addClass('button button--'+attrs.button);
});



dom.compiler.register('attribute', 'align', function(elem, attrs){

    if( 'align' in attrs && attrs.align.length ){

        elem.addClass('align-'+attrs.align);
    }
});



dom.compiler.register('attribute', 'hide-on', function(elem, attrs){

    if( 'hideOn' in attrs && attrs.hideOn.length ) {

        var hideOn = attrs.hideOn.indexOf('{{')==-1 ? attrs.hideOn.replace(' ', '-') : attrs.hideOn;

        elem.addClass('ux-hide--' + hideOn);
    }
});



dom.compiler.register('attribute', 'show-on', function(elem, attrs){

    if( 'showOn' in attrs && attrs.showOn.length ) {

        var showOn = attrs.showOn;
        var hideOn = false;

        if (showOn == "mobile")
            hideOn = "desktop tablet";

        if (showOn == "desktop")
            hideOn = "mobile-tablet";

        if (showOn == "tablet")
            hideOn = "mobile desktop";

        if( hideOn ){

            if( hideOn.indexOf('{{')==-1 ){

                var hideOn_map = hideOn.split(' ');
                elem.addClass('ux-hide ux-hide--' + hideOn_map.join(' ux-hide--'));
            }
            else{

                elem.addClass('ux-hide ux-hide--' + hideOn);
            }
        }
    }
});

['block', 'icon', 'icon', 'page', 'component', 'tmp', 'misc'].map(function(type){

    dom.compiler.register('attribute', type+'-src', function(elem, attrs){

        if (window.precompile){

            var src = attrs[type+'Src'].replace('{{','\' ~ ').replace('}}',' ~ \'');
            elem.attr('src', "{{ asset_url('/media/"+type+"/" + src + "') }}");
        }
        else{

            if( typeof app == "undefined" || ! 'asset' in app  ) {

                console.warn('app.asset not defined');
                elem.attr('src', attrs[type+'Src']);
            }
            else {

                elem.attr('src', app.asset + '/media/'+type+'/' + attrs[type+'Src']);
            }
        }
    });

    dom.compiler.register('attribute', type+'-background', function(elem, attrs){

        if (window.precompile){

            var src = attrs[type+'Background'].replace('{{','\' ~ ').replace('}}',' ~ \'');
            elem.attr('style', "background-image:url('{{ asset_url('/media/"+type+"/" + src + "') }}')");
        }
        else{

            if( typeof app == "undefined" || ! 'asset' in app  ) {

                console.warn('app.asset not defined');
                elem.css('backgroundImage',  'url("'+attrs[type+'Background']+'")');
            }
            else {

                elem.css('backgroundImage', "url('"+app.asset + "/media/" + type + "/" + attrs[type+'Src']+"')");
            }
        }
    });
});


dom.compiler.register('attribute', 'remove-on', function(elem, attrs){

    if( attrs.removeOn && attrs.removeOn.length ) {

        var removeOn = attrs.removeOn;

        if ((removeOn == "mobile" && browser && browser.mobile) || (removeOn == "desktop" && browser && browser.desktop))
            elem.remove();
    }
});



dom.compiler.register('attribute', 'vcenter', function(elem){

    if( elem.is('div') || elem.is('header') || elem.is('article') || elem.is('footer') || elem.is('main') )
        elem.wrapInner('<div class="valign"><div class="valign__middle"></div></div>');
    else
        elem.wrapInner('<span class="valign"><span class="valign__middle"></span></span>');
});



dom.compiler.register('element', 'vcenter', function(elem){

    var $parent = elem.parent();

    if( $parent.is('div') || $parent.is('header') || $parent.is('article') || $parent.is('footer') || $parent.is('main') )
        return '<div class="valign"><div class="valign__middle"><transclude/></div></div>';
    else
        return '<span class="valign"><span class="valign__middle"><transclude/></span></span>';
});



dom.compiler.register('element', 'youtube-embed', function(elem, attrs){

    var options = {

        defer          : 0,
        autoplay       : 0,
        autohide       : 2,
        color          : 'red',
        modestbranding : 1,
        rel            : 0,
        showinfo       : 0,
        theme          : 'light',
        hl             : 'en',
        controls       : 1
    };

    $.each(options, function(index){

        if( typeof attrs[index] !== "undefined" )
            options[index] =  attrs[index];
    });

    var url = 'https://www.youtube.com/embed/'+attrs.id+'?'+ $.param(options);

    if( options.defer )
        return '<iframe data-src="'+url+'" allowfullscreen class="youtube-embed ux-defer"></iframe>';
    else
        return '<iframe src="'+url+'" allowfullscreen class="youtube-embed"></iframe>';
});



dom.compiler.register('element', 'vtop', function(elem){

    var $parent = elem.parent();

    if( $parent.is('a') || $parent.is('span') )
        return '<span class="valign"><span class="valign__top"><transclude/></span></span>';
    else
        return '<div class="valign"><div class="valign__top"><transclude/></div></div>';
});



dom.compiler.register('element', 'vbottom', function(elem){

    var $parent = elem.parent();

    if( $parent.is('a') || $parent.is('span') )
        return '<span class="valign"><span class="valign__bottom"><transclude/></span></span>';
    else
        return '<div class="valign"><div class="valign__bottom"><transclude/></div></div>';
});