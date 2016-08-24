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

    var self = this;

    self.context = {
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

    self.config = {
        class     :{
            offset : 'ui-scroll-offset',
            detect : 'ui-detect-scroll'
        },
        force_offset : false
    };


    self.add = function ( $element ) {

        if( !$element || !$element.length )
            return;

        var element = {
            $          : $element,
            position   : $element.data('detect-scroll'),
            top        : $element.offset().top,
            reached    : false
        };

        element.bottom = element.top + $element.outerHeight();

        self.context.elements.push(element);

        self._detect();
    };



    self._resize = function(){

        for (var i in self.context.elements) {

            var element = self.context.elements[i];

            if( !element.reached ){

                element.top    = element.$.offset().top;
                element.bottom = element.top + element.$.outerHeight();
            }
        }

        self.context.window_height   = $(self.context.$window).height();
        self.context.document_height = $(document).height();

        self._computeOffset();
    };


    self._computeOffset = function(){

        if( self.config.force_offset )
            return;

        var $offset = $('.'+self.config.class.offset);
        var offset  = 0;

        $offset.each(function(){

            if( $(this).is(':visible') && ($(this).css('position') == "fixed"||$(this).css('position') == "absolute") && $(this).css('transform') == "none" )
                offset += $(this).outerHeight();
        });

        self.context.offset = offset;
    };


    self._detectScrollDirectionChange = function (scroll_top) {

        self.context.scroll_down = scroll_top > self.context.scroll_top;
        self.context.scroll_top  = scroll_top;

        if( self.context.scroll_down && !self.context.scroll_class_added ){

            if( !self.context.scroll_dir_changed_at || self.context.scroll_dir_changed_at > self.context.scroll_top  )
                self.context.scroll_dir_changed_at = self.context.scroll_top;

            if( self.context.scroll_dir_changed_at + self.context.offset < self.context.scroll_top ){

                self.context.scroll_dir_changed_at = false;
                self.context.scroll_class_added    = true;

                self.context.$body.addClass('scroll--down').removeClass('scroll--up')
            }
        }

        if( !self.context.scroll_down && self.context.scroll_class_added ){

            if( !self.context.scroll_dir_changed_at || self.context.scroll_dir_changed_at < self.context.scroll_top )
                self.context.scroll_dir_changed_at = self.context.scroll_top;

            if( self.context.scroll_dir_changed_at - self.context.offset > self.context.scroll_top || self.context.scroll_top <= self.context.offset){

                self.context.scroll_dir_changed_at = false;
                self.context.scroll_class_added    = false;

                self.context.$body.addClass('scroll--up').removeClass('scroll--down');
            }
        }
    };


    self._detectScrollBoundReached = function (scroll_top) {

        if( scroll_top <= 1 && !self.context.top_reached ){

            self.context.top_reached = true;
            self.context.$body.addClass('scroll--top-reached').removeClass('scroll--body');
        }

        if( scroll_top > 1 && self.context.top_reached ) {

            self.context.top_reached = false;
            self.context.$body.removeClass('scroll--top-reached').addClass('scroll--body');
        }

        if( scroll_top+self.context.window_height >= self.context.document_height && !self.context.bottom_reached ){

            self.context.bottom_reached = true;
            self.context.$body.addClass('scroll--bottom-reached');
        }

        if( scroll_top+self.context.window_height < self.context.document_height && self.context.bottom_reached){

            self.context.bottom_reached = false;
            self.context.$body.removeClass('scroll--bottom-reached');
        }
    };


    self._detect = function () {

        var scrollTop = self.context.$window.scrollTop();

        self._detectScrollBoundReached(scrollTop);
        self._detectScrollDirectionChange(scrollTop);

        for (var i in self.context.elements) {

            var element  = self.context.elements[i];

            if( !element.reached && (element.position=='top-reached' ? element.top : element.bottom ) <= scrollTop+self.context.offset ){

                element.reached = true;
                element.$.addClass(element.position);
                $(document).trigger('ui-top-reached', [true, element.id]);
            }
            else if( element.reached && (element.position=='top-reached' ? element.top : element.bottom ) > scrollTop+self.context.offset ){

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
    self.__construct =  function(){

        if( self.config.force_offset )
            self.context.offset = self.config.force_offset;

        $('.'+self.config.class.detect).initialize(function(){
            self.add( $(this) )
        });

        $(document).on('loaded', function(){

            self._resize();
            self._detect();

            self.context.$window.on('scroll', self._detect).on('resize', self._resize);
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
    self.__construct();
};

var ui = ui || {};
ui.detectScroll = new UIDetectScroll();