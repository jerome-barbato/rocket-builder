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

        $(document)
            .on('boot', self._recompute)
            .on('loaded', self._recompute);

        $(window)
            .scroll(function(){ requestAnimationFrame(self._update) })
            .resize(self._recompute);
    };



    self._recompute = function(){

        self.context.window_height   = $(window).height();
        self.context.document_height = $(document).height();

        $.each(self.context.items, function(i, item){

            item.top    = item.$container.offset().top - parseInt(item.$container.css('marginTop').replace('px',''));
            item.height = item.$container.height();
            item.bottom = item.top+item.height;
        });

        self._update();
    };



    self._update = function(){

        self.context.scroll_top = $(window).scrollTop();

        $.each(self.context.items, function(i, item){

            var offset = false;

            if( self.context.scroll_top + self.context.window_height > item.top && item.bottom > self.context.scroll_top) {

                if( item.top < self.context.window_height )
                    offset = self.context.scroll_top / item.bottom;
                else
                    offset = (self.context.scroll_top + self.context.window_height - item.top) / (item.bottom + self.context.window_height - item.top);

                offset = (Math.round(offset*1000)/1000);
            }
            else{

                offset = self.context.scroll_top + self.context.window_height > item.top;
            }

            offset = item.invert ? 1-offset : offset;

            if( offset !== false && item.offset != offset ){

                item.offset = item.center ? offset-0.5 : offset;

                if( !item.center && item.offset < 0.01 )
                    item.$element.css('transform', 'none');
                else
                    item.$element.css('transform', 'translate3d(0,'+(item.offset*item.strenght)+item.unit+',0)');
            }
        });
    };



    self._add = function( $element ){

        var parallax = $element.data('parallax');

        var unit = parallax.indexOf('%') > 0 ? '%' : 'px';
        unit = parallax.indexOf('rem') > 0 ? 'rem' : unit;
        unit = parallax.indexOf('vh') > 0 ? 'vh' : unit;

        var invert = parallax.substr(0,1) == '!';

        parallax = parallax.replace('!','');

        self.context.items.push({
            $element   : $element,
            $container : $element.parent().hasClass('parallax-container') ? $element.parent() : $element,
            strenght   : parseInt( parallax.replace(unit,'') ),
            unit       : unit,
            invert     : invert,
            center     : $element.hasDataAttr('parallax-center') ? parseInt($element.data('parallax-center')) : false
        });
    };



    /* Contructor. */

    /**
     *
     */
    self.__construct = function() {

        if( (browser && browser.mobile && !self.config.mobile) || typeof requestAnimationFrame == 'undefined' )
            return;

        self._setupEvents();

        $('[data-parallax]').initialize(function(){

            self._add( $(this) );
        });
    };



    if( typeof DOMCompiler !== "undefined" ){

        dom.compiler.register('attribute', 'parallax-container', function(elem, attrs) {

            elem.addClass('parallax-container');
        });

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
