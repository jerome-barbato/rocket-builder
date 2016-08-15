/**
 * Parallax
 *
 * Copyright (c) 2014 - Metabolism
 * Author:
 *   - Jérome Barbato <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 1.0
 *
 * Changelog
 *
 * Requires:
 *   - jQuery
 *
 **/

var UIParallax = function () {

    var that = this;

    that.config = {
        mobile : false,
        type   : 'down'
    };


    that.context = {
        window_height   : 0,
        document_height : 0,
        scroll_top      : 0,
        items           : []
    };


    that._setupEvents = function(){

        $(document).on('loaded', function(){

            that._resize();
            that._update();
        });

        $(window)
            .scroll(function(){ requestAnimationFrame(that._update) })
            .resize(function(){ that._resize(); requestAnimationFrame(that._update) });
    };



    that._resize = function(){

        that.context.window_height   = $(window).height();
        that.context.document_height = $(document).height();

        $.each(that.context.items, function(i, item){

            item.top    = item.$.offset().top;
            item.height = item.$.height();
            item.bottom = item.top+item.height;
        });
    };



    that._update = function(){

        that.context.scroll_top = $(window).scrollTop();

        $.each(that.context.items, function(i, item){

            if( that.context.scroll_top + that.context.window_height > item.top && item.bottom > that.context.scroll_top) {

                if( item.top < that.context.window_height )
                    item.offset = that.context.scroll_top / item.bottom;
                else
                    item.offset = (that.context.scroll_top + that.context.window_height - item.top) / (item.bottom + that.context.window_height - item.top);

                item.offset = item.center ? item.offset-0.5 : item.offset;
                item.offset = (Math.round(-item.offset*1000)/1000);

                item.$.css('transform', 'translate3d(0,'+(item.offset*item.strenght)+item.unit+',0)');
            }
            else{

                var offset = 0;

                if( that.context.scroll_top + that.context.window_height <= item.top )
                    offset = (item.center ? 0.5 : 0)*item.strenght;
                else
                    offset = -(item.center ? 0.5 : 1)*item.strenght;

                if( item.offset != offset ){

                    item.offset = offset;
                    item.$.css('transform', 'translate3d(0,'+item.offset+item.unit+',0)');
                }
            }
        });
    };


    that._add = function( $element ){

        that.context.items.push({
            $        : $element,
            strenght : parseInt($element.data('parallax')),
            unit     : $element.data('parallax-unit'),
            center   : $element.data('parallax-center')});
    }

    /* Contructor. */

    /**
     *
     */
    that.__construct = function () {

        if( browser && browser.mobile && !that.config.mobile )
            return;

        $('.ui-parallax').initialize(function(){

            that._add( $(this) );
        });

        $(document).on('loaded', function(){

            that._resize();
            that._update();
        });

        that._setupEvents();
    };



    if( typeof DOMCompiler !== "undefined" ){

        dom.compiler.register('attribute', 'parallax', function(elem, attrs) {

            var unit = attrs.parallax.indexOf('%') > 0 ? '%' : 'px';
            unit = attrs.parallax.indexOf('rem') > 0 ? 'rem' : unit;
            unit = attrs.parallax.indexOf('vh') > 0 ? 'vh' : unit;

            dom.compiler.attr(elem, 'parallax', parseInt(attrs.parallax.replace(unit, '')));
            dom.compiler.attr(elem, 'parallax-unit', unit);
            dom.compiler.attr(elem, 'parallax-center', attrs.center ? attrs.center !== "true" : true);

            elem.addClass('ui-parallax');

        }, that._add);
    }


    that.__construct();
};


var ui = ui || {};
ui.parallax = new UIParallax();
