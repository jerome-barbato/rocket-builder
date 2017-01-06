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

var UXDetectScroll = function(){

    var self = this;

    self.context = {
        init                    : false,
        elements                : [],
        $window                 : $(window),
        $body                   : $('body'),
        window_height           : 0,
        document_height         : 0,
        scroll_top              : 0,
        scroll_down             : false,
        in_between              : false,
        scroll_dir_changed_at   : 0,
        offset                  : 0,
        top_reached             : true,
        bottom_reached          : false
    };

    self.config = {
        class     :{
            offset : 'ux-scroll-offset'
        },
        force_offset : false
    };


    self.add = function( $element ) {

        if( !$element || !$element.length )
            return;

        var element = {
            $          : $element,
            position   : $element.hasDataAttr('detect-scroll') ? $element.data('detect-scroll') : 'top-reached',
            top        : self._getOffset($element).top,
            reached    : false
        };

        element.$.attr('data-top',element.top)

        element.bottom = element.top + $element.outerHeight();

        self.context.elements.push(element);

        self._detect();
    };



    self._resize = function(){

        for (var i=0; i < self.context.elements.length; i++) {

            var element = self.context.elements[i];

            if( !element.reached ){

                element.top    = self._getOffset(element.$).top;
                element.bottom = element.top + element.$.outerHeight();
            }

            element.$.attr('data-top', element.top)
        }

        self.context.window_height   = $(self.context.$window).height();
        self.context.document_height = $(document).height();

        self._computeOffset();
        self._detect();
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


    self._detectScrollDirectionChange = function(scroll_top) {

        var scroll_down = scroll_top > self.context.scroll_top;
        self.context.scroll_top  = scroll_top;

        if( scroll_down && !self.context.scroll_down )
            self.context.$body.addClass('scroll--down').removeClass('scroll--up');
        else if( !scroll_down && self.context.scroll_down )
            self.context.$body.addClass('scroll--up').removeClass('scroll--down');

        self.context.scroll_down = scroll_down;
    };


    self._detectScrollBoundReached = function(scroll_top) {

        if( !self.context.document_height || !self.context.window_height )
            return;

        if( scroll_top <= 5 ){

            if( !self.context.top_reached ) {

                self.context.top_reached    = true;
                self.context.in_between     = false;
                self.context.bottom_reached = false;
                self.context.$body.addClass('scroll--top-reached').removeClass('scroll--between scroll--bottom-reached');

                self.context.$body.trigger('ux-scroll.top-reached');
            }
        }
        else if( scroll_top > 5 && scroll_top+self.context.window_height < self.context.document_height ) {

            if( !self.context.in_between ) {

                self.context.top_reached = false;
                self.context.in_between = true;
                self.context.bottom_reached = false;
                self.context.$body.addClass('scroll--between  has-scrolled').removeClass('scroll--top-reached scroll--bottom-reached');

                self.context.$body.trigger('ux-scroll.between');
            }
        }
        else if( scroll_top+self.context.window_height >= self.context.document_height ){

            if( !self.context.bottom_reached ){

                self.context.top_reached    = false;
                self.context.in_between     = false;
                self.context.bottom_reached = true;
                self.context.$body.addClass('scroll--bottom-reached').removeClass('scroll--between scroll--top-reached');

                self.context.$body.trigger('ux-scroll.bottom-reached');
            }
        }
    };


    self._detect = function() {

        var scrollTop = self.context.$window.scrollTop();

        self._detectScrollBoundReached(scrollTop);
        //self._detectScrollDirectionChange(scrollTop);

        for (var i=0; i< self.context.elements.length; i++) {

            var element  = self.context.elements[i];

            if( (element.position=='top-reached' ? element.top : element.bottom ) <= scrollTop+self.context.offset ){

                if( !element.reached ){

                    element.reached = true;
                    element.$.addClass(element.position);
                }
            }
            else if( (element.position=='top-reached' ? element.top : element.bottom ) > scrollTop+self.context.offset ){

                if( element.reached ){

                    element.reached = false;
                    element.$.removeClass(element.position);
                }
            }
        }
    };

    self._getOffset = function( $element ){

        var el = $element.get(0);

        var _x = 0; var _y = 0;

        while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {

            _x += el.offsetLeft;
            _y += el.offsetTop;
            el = el.offsetParent;

        }

        return { top: _y, left: _x };
    };

    /* Contructor. */

    /**
     *
     */
    self.__construct =  function(){

        if( self.config.force_offset )
            self.context.offset = self.config.force_offset;

        $('[data-detect-scroll]').initialize(function(){
            self.add( $(this) )
        });

        $(document).on('boot', self._resize);

        self.context.$window
            .on('scroll', self._detect)
            .on('loaded', self._resize)
            .on('resize', self._resize);
    };


    if( typeof DOMCompiler !== "undefined" ) {

        dom.compiler.register('attribute', 'detect-scroll', function(elem, attrs) {

            elem.attr('data-detect-scroll', attrs.detectScroll);

        }, self.add);

        dom.compiler.register('attribute', 'fixed-header', function(elem, attrs) {

            elem.addClass('ux-scroll-offset');

            if( elem.attr('id') == undefined && attrs.fixedHeader )
                elem.attr('id', attrs.fixedHeader);
        });
    }


    /* Public */
    self.__construct();
};

var ux = ux || {};
ux.detectScroll = new UXDetectScroll();