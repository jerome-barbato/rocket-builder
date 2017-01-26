/**
 * On Demand Loader
 *
 * Copyright (c) 2014 - Metabolism
 * Author:
 *   - Jérome Barbato <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 1.3
 *
 *
 * Requires:
 *   - jQuery
 *
 **/

var UXOnDemand = function(){

    var self = this;

    self.context = {
        init          : false,
        elements      : [],
        window_height : 0
    };

    self.selector = 'ux-on-demand';

    self.config = {
        load : 1.9
    };


    self.add = function( $element ) {

        if( $element.parents('.ux-preload').length )
            return;

        $element.addClass(self.selector+' '+self.selector+'--waiting');

        var use_parent = false;
        var $parent    = false;

        if( $element.hasClass('ux-fit__object') ){

            $parent    = $element.closest('.ux-fit');
            use_parent = $parent.length;
        }

        var top        = use_parent ? $parent.offset().top : $element.offset().top;
        var height     = use_parent ? $parent.height() : $element.height();

        var element = {
            $          : $element,
            top        : top,
            bottom     : top+height,
            preloaded  : false,
            loaded     : false,
            $parent    : $parent,
            use_parent : use_parent,
            type       : 'default',
            src        : $element.data('src'),
            visible    : $element.is(':visible')
        };


        if( $element.is('img') )
            element.type = 'img';

        if( $element.is('video') ){

            element.type = 'video';
            $element.attr('preload', 'none');
            $element.html('<source src="'+element.src+'" type="video/mp4"><source src="'+element.src.replace('.mp4', '.webm')+'" type="video/webm">');
        }

        self.context.elements.push(element);

        self._load(element, $(window).scrollTop());
    };



    self._resize = function(){

        self.context.window_height = $(window).height();

        for (var i=0; i< self.context.elements.length; i++) {

            var element  = self.context.elements[i];
            var top      = element.use_parent ? element.$parent.offset().top : element.$.offset().top;
            var height   = element.use_parent ? element.$parent.height() : element.$.height();

            element.top     = top;
            element.visible = element.$.is(':visible');
            element.bottom  = top+height;
        }
    };



    self._loaded = function(element){

        element.$.removeClass(self.selector+'--loading').addClass(self.selector+'--loaded');

        if( $.fn.fit )
            element.$.fit(true);

        element.loaded = true;

        self.applyPlayState(element, $(window).scrollTop());
    };



    self._load = function(element, scrollTop){

        var targetScroll = scrollTop + self.context.window_height*self.config.load;

        if( !element.preloaded && element.visible && element.top <= targetScroll ){

            element.preloaded = true;
            element.$.removeClass(self.selector+'--waiting').addClass(self.selector+'--loading');

            switch( element.type ) {

                case 'img':

                    (function(elem) {

                        elem.$.on('load', function() { self._loaded(elem) });

                    })(element);

                    element.$.attr('src', '');
                    element.$.attr('src', element.src);

                    break;

                case "video" :

                    (function(elem) {

                        elem.$.on('loadeddata', function(){ self._loaded(elem) });
                        elem.$.on('ended', function(){ elem.ended = true });

                    })(element);

                    element.ended = false;
                    element.loop  = element.$.attr('loop') == "loop";
                    element.$.attr('preload', 'auto').attr('autoplay', false);

                    break;

                default :

                    (function(elem) {

                        $('<img/>').on('load', function() { self._loaded(elem) }).attr('src', elem.src);

                    })(element);

                    element.$.css('background-image', "url('"+element.src+"')");

                    break;
            }
        }

        self.applyPlayState(element, scrollTop);
    };


    self.applyPlayState = function(element, scrollTop){

        if( element.type == "video" && element.loaded ){

            if( element.top < scrollTop+self.context.window_height && element.bottom > scrollTop){

                if( !element.play && (element.loop || !element.ended) ){

                    element.$.addClass(self.selector+'--playing').removeClass(self.selector+'--paused');
                    element.$.get(0).play();
                    element.play = true;
                }
            }
            else if( element.play ){

                element.$.addClass(self.selector+'--paused').removeClass(self.selector+'--playing');
                element.$.get(0).pause();
                element.play = false;
            }
        }

    };


    self._loadAll = function() {

        var scrollTop = $(window).scrollTop();

        for (var i in self.context.elements) {

            var element = self.context.elements[i];
            self._load(element, scrollTop);
        }
    };



    /* Contructor. */

    /**
     *
     */
    self.__construct =  function(){

        $('[data-src]').initialize(function(){
            self.add($(this))
        });


        $(window).on('scroll', self._loadAll).on('resize', function(){

            self._resize();
            self._loadAll()
        });


        $(document).on('loaded', function(){

            self._resize();
            setTimeout(self._loadAll, 300);
        });
    };


    if( typeof DOMCompiler !== "undefined" ) {

        dom.compiler.register('attribute', 'on-demand', function(elem, attrs) {

            var src = elem.attr('src');

            if( elem.is('img') )
                elem.attr('src', "{{ blank() }}");

            elem.attr('data-src', attrs.onDemand.length ? attrs.onDemand : src );

        }, self.add);
    }


    /* Public */
    self.__construct();
};

var ux = ux || {};
ux.onDemand = new UXOnDemand();