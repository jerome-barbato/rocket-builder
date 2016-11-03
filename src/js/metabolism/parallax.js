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

var UXParallax = function() {

    var self = this;

    self.config = {
        mobile : false,
        type   : 'down'
    };


    self.context = {
        window_height   : 0,
        document_height : 0,
        scroll_top      : 0,
        items           : []
    };


    self._setupEvents = function(){

        $(document).on('loaded', function(){

            self._resize();
            self._update();
        });

        $(window)
            .scroll(function(){ requestAnimationFrame(self._update) })
            .resize(function(){ self._resize(); requestAnimationFrame(self._update) });
    };



    self._resize = function(){

        self.context.window_height   = $(window).height();
        self.context.document_height = $(document).height();

        $.each(self.context.items, function(i, item){

            item.top    = item.$.offset().top;
            item.height = item.$.height();
            item.bottom = item.top+item.height;
        });
    };



    self._update = function(){

        self.context.scroll_top = $(window).scrollTop();

        $.each(self.context.items, function(i, item){

            if( self.context.scroll_top + self.context.window_height > item.top && item.bottom > self.context.scroll_top) {

                if( item.top < self.context.window_height )
                    item.offset = self.context.scroll_top / item.bottom;
                else
                    item.offset = (self.context.scroll_top + self.context.window_height - item.top) / (item.bottom + self.context.window_height - item.top);

                item.offset = item.center ? item.offset-0.5 : item.offset;
                item.offset = (Math.round(-item.offset*1000)/1000);

                if( item.offset*item.strenght == 0 )
                    item.$.css('transform', 'none');
                else
                    item.$.css('transform', 'translate3d(0,'+(item.offset*item.strenght)+item.unit+',0)');
            }
            else{

                var offset = 0;

                if( self.context.scroll_top + self.context.window_height <= item.top )
                    offset = (item.center ? 0.5 : 0)*item.strenght;
                else
                    offset = -(item.center ? 0.5 : 1)*item.strenght;

                if( item.offset != offset ){

                    item.offset = offset;

                    if( item.offset == 0 )
                        item.$.css('transform', 'none');
                    else
                        item.$.css('transform', 'translate3d(0,'+item.offset+item.unit+',0)');
                }
            }
        });
    };


    self._add = function( $element ){

        var parallax = $element.data('parallax');

        var unit = parallax.indexOf('%') > 0 ? '%' : 'px';
        unit = parallax.indexOf('rem') > 0 ? 'rem' : unit;
        unit = parallax.indexOf('vh') > 0 ? 'vh' : unit;

        self.context.items.push({
            $        : $element,
            strenght : parseInt( parallax.replace(unit,'') ),
            unit     : unit,
            center   : parseInt($element.data('parallax-center'))
        });
    };

    /* Contructor. */

    /**
     *
     */
    self.__construct = function() {

        if( browser && browser.mobile && !self.config.mobile )
            return;

        $('[data-parallax]').initialize(function(){

            self._add( $(this) );
        });

        self._setupEvents();
    };



    if( typeof DOMCompiler !== "undefined" ){

        dom.compiler.register('attribute', 'parallax', function(elem, attrs) {

            if( elem.hasDataAttr('animation') ){

                console.warn('Parallax and animation are not compatible, please add an extra node ( parallax : "'+attrs.parallax+'", animation : "'+elem.data('animation')+'")');
                return;
            }

            dom.compiler.attr(elem, 'parallax', attrs.parallax);

            if( attrs.parallaxCenter ){

                dom.compiler.attr(elem, 'parallax-center', attrs.parallaxCenter || attrs.parallaxCenter == "true" ? "1" : "0");
                elem.removeAttr('parallax-center');
            }

        }, self._add);
    }


    self.__construct();
};


var ux = ux || {};
ux.parallax = new UXParallax();
