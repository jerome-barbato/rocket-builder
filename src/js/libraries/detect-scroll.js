/**
 * On Top
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

var UIDetectScroll = function(){

    var that = this;

    that.context = {
        init                  : false,
        elements              : [],
        $window               : $(window),
        $body                 : $('body'),
        window_height         : 0,
        document_height       : 0,
        scroll_top            : 0,
        scroll_down           : false,
        scroll_class_added    : false,
        scroll_dir_changed_at : 0,
        offset                : 0,
        top_reached           : false,
        bottom_reached        : false
    };

    that.config = {
        class     :{
            offset : 'ui-scroll-offset',
            detect : 'ui-detect-scroll'
        },
        force_offset : false
    };


    that.add = function ( $element ) {

        if( !$element || !$element.length )
            return;

        var element = {
            $          : $element,
            position   : $element.data('detect-scroll'),
            top        : $element.offset().top,
            reached    : false
        };

        element.bottom = element.top + $element.outerHeight();

        that.context.elements.push(element);

        that._detect();
    };



    that._resize = function(){

        for (var i in that.context.elements) {

            var element = that.context.elements[i];

            if( !element.reached ){

                element.top    = element.$.offset().top;
                element.bottom = element.top + element.$.outerHeight();
            }
        }

        that.context.window_height   = $(that.context.$window).height();
        that.context.document_height = $(document).height();

        that._computeOffset();
    };


    that._computeOffset = function(){

        if( that.config.force_offset )
            return;

        var $offset = $('.'+that.config.class.offset);
        var offset  = 0;

        $offset.each(function(){

            if( $(this).is(':visible') && ($(this).css('position') == "fixed"||$(this).css('position') == "absolute") && $(this).css('transform') == "none" )
                offset += $(this).outerHeight();
        });

        that.context.offset = offset;
    };


    that._detectScrollDirectionChange = function (scroll_top) {

        that.context.scroll_down = scroll_top > that.context.scroll_top;
        that.context.scroll_top  = scroll_top;

        if( that.context.scroll_down && !that.context.scroll_class_added ){

            if( !that.context.scroll_dir_changed_at || that.context.scroll_dir_changed_at > that.context.scroll_top  )
                that.context.scroll_dir_changed_at = that.context.scroll_top;

            if( that.context.scroll_dir_changed_at + that.context.offset < that.context.scroll_top ){

                that.context.scroll_dir_changed_at = false;
                that.context.scroll_class_added    = true;

                that.context.$body.addClass('scroll--down').removeClass('scroll--up')
            }
        }

        if( !that.context.scroll_down && that.context.scroll_class_added ){

            if( !that.context.scroll_dir_changed_at || that.context.scroll_dir_changed_at < that.context.scroll_top )
                that.context.scroll_dir_changed_at = that.context.scroll_top;

            if( that.context.scroll_dir_changed_at - that.context.offset > that.context.scroll_top || that.context.scroll_top <= that.context.offset){

                that.context.scroll_dir_changed_at = false;
                that.context.scroll_class_added    = false;

                that.context.$body.addClass('scroll--up').removeClass('scroll--down');
            }
        }
    };


    that._detectScrollBoundReached = function (scroll_top) {

        if( scroll_top <= 1 && !that.context.top_reached ){

            that.context.top_reached = true;
            that.context.$body.addClass('scroll--top-reached').removeClass('scroll--body');
        }

        if( scroll_top > 1 && that.context.top_reached ) {

            that.context.top_reached = false;
            that.context.$body.removeClass('scroll--top-reached').addClass('scroll--body');
        }

        if( scroll_top+that.context.window_height >= that.context.document_height && !that.context.bottom_reached ){

            that.context.bottom_reached = true;
            that.context.$body.addClass('scroll--bottom-reached');
        }

        if( scroll_top+that.context.window_height < that.context.document_height && that.context.bottom_reached){

            that.context.bottom_reached = false;
            that.context.$body.removeClass('scroll--bottom-reached');
        }
    };


    that._detect = function () {

        var scrollTop = that.context.$window.scrollTop();

        that._detectScrollBoundReached(scrollTop);
        that._detectScrollDirectionChange(scrollTop);

        for (var i in that.context.elements) {

            var element  = that.context.elements[i];

            if( !element.reached && (element.position=='top-reached' ? element.top : element.bottom ) <= scrollTop+that.context.offset ){

                element.reached = true;
                element.$.addClass(element.position);
                $(document).trigger('ui-top-reached', [true, element.id]);
            }
            else if( element.reached && (element.position=='top-reached' ? element.top : element.bottom ) > scrollTop+that.context.offset ){

                element.reached = false;
                element.$.removeClass(element.position);
                $(document).trigger('ui-top-reached', [false, element.id]);
            }
        }
    };



    /* Contructor. */

    /**
     *
     */
    that.__construct =  function(){

        if( that.config.force_offset )
            that.context.offset = that.config.force_offset;

        $('.'+that.config.class.detect).initialize(function(){
            that.add( $(this) )
        });

        $(document).on('loaded', function(){

            that._resize();
            that._detect();

            that.context.$window.on('scroll', that._detect).on('resize', that._resize);
        });
    };


    if( typeof DOMCompiler !== "undefined" ) {

        dom.compiler.register('attribute', 'detect-scroll', function (elem, attrs) {

            elem.addClass('ui-detect-scroll');

            if( window.precompile )
                elem.attr('data-detect-scroll', attrs.detectScroll);
            else
                elem.data('detect-scroll', attrs.detectScroll);
        });

        dom.compiler.register('attribute', 'fixed-header', function (elem, attrs) {

            elem.addClass('ui-scroll-offset');

            if( elem.attr('id') == undefined && attrs.fixedHeader )
                elem.attr('id', attrs.fixedHeader);
        });
    }


    /* Public */
    that.__construct();
};

var ui = ui || {};
ui.detectScroll = new UIDetectScroll();