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

var UIOnDemand = function(){

    var that = this;

    that.context = {
        init          : false,
        elements      : [],
        window_height : 0
    };

    that.selector = 'ui-on-demand';

    that.config = {
        load : 1.9
    };


    that.add = function ( $element ) {

        if( $element.parents('.ui-preload').length )
            return;

        $element.addClass(that.selector+'--waiting');

        var use_parent = false;
        var $parent    = false;

        if( $element.hasClass('ui-fit__object') ){

            $parent    = $element.closest('.ui-fit');
            use_parent = true;
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
            src        : $element.data('src')
        };


        if( $element.is('img') )
            element.type = 'img';

        if( $element.is('video') ){

            element.type = 'video';
            $element.attr('preload', 'none');
            $element.html('<source src="'+element.src+'" type="video/mp4"><source src="'+element.src.replace('.mp4', '.webm')+'" type="video/webm">');
        }

        that.context.elements.push(element);
    };



    that._resize = function(){

        that.context.window_height = $(window).height();

        for (var i in that.context.elements) {

            var element  = that.context.elements[i];
            var top      = element.use_parent ? element.$parent.offset().top : element.$.offset().top;
            var height   = element.use_parent ? element.$parent.height() : element.$.height();

            element.top     = top;
            element.visible = element.$.is(':visible');
            element.bottom  = top+height;
        }
    };



    that._loaded = function(element){

        element.$.removeClass(that.selector+'--loading').addClass(that.selector+'--loaded');
        element.loaded = true;
    };



    that._load = function () {

        var scrollTop    = $(window).scrollTop();
        var targetScroll = scrollTop + that.context.window_height*that.config.load;

        for (var i in that.context.elements) {

            var element  = that.context.elements[i];
            var $element = element.$;

            if( !element.preloaded && element.visible && element.top <= targetScroll ){

                element.preloaded = true;
                $element.removeClass(that.selector+'--waiting').addClass(that.selector+'--loading');

                switch( element.type ) {

                    case 'img':

                        (function(elem) {

                            elem.$.on('load', function () { that._loaded(elem) });

                        })(element);

                        $element.attr('src', element.src);

                        break;

                    case "video" :

                        (function(elem) {

                            elem.$.on('loadeddata', function(){ that._loaded(elem) });

                        })(element);

                        $element.attr('preload', 'auto').attr('autoplay', false);

                        break;

                    default :

                        (function(elem) {

                            $('<img/>').on('load', function() { that._loaded(elem) }).attr('src', elem.src);

                        })(element);

                        $element.css('background-image', "url('"+element.src+"')");

                        break;
                }
            }


            if( element.type == "video" && element.preloaded ){

                if( element.top < scrollTop+that.context.window_height && element.bottom > scrollTop){

                    if( !element.play ){

                        $element.addClass(that.selector+'--playing').removeClass(that.selector+'--paused');
                        $element.get(0).play();
                        element.play = true;
                    }
                }
                else if( element.play ){

                    $element.addClass(that.selector+'--paused').removeClass(that.selector+'--playing');
                    $element.get(0).pause();
                    element.play = false;
                }
            }
        }
    };



    /* Contructor. */

    /**
     *
     */
    that.__construct =  function(){

        $('.ui-on-demand').initialize(function(){
            that.add($(this))
        });
        
        
        $(window).on('scroll', that._load).on('resize', function(){
            that._resize();
            that._load()
        });
        

        $(document).on('loaded', function(){

            that._resize();
            setTimeout(that._load, 300);
        });
    };


    if( typeof DOMCompiler !== "undefined" ) {

        dom.compiler.register('attribute', 'on-demand', function (elem, attrs) {

            elem.addClass('ui-on-demand');
            
            if( window.precompile ){

                elem.attr('data-src', attrs.onDemand);
                elem.attr('src', "{{ blank() }}");
            }
            else{

                elem.data('src', attrs.onDemand);
            }

        }, that.add);
    }


    /* Public */
    that.__construct();
};

var ui = ui || {};
ui.onDemand = new UIOnDemand();