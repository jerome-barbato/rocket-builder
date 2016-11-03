/**
 * Scroll
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

var UXScroll = function() {

    var self = this;

    self.config = {
        speed     : 600,
        easeIn    : 'easeOutCubic',
        easeOut   : 'easeInCubic',
        easeInOut : 'easeInOutCubic',
        offset    : 0,
        class     : {
            link   : 'ux-scroll',
            offset : 'ux-scroll-offset',
            target : 'ux-scroll--target'
        },
        force_offset : false,
        user_anchor  : true
    };

    self.targets     = [];
    self.offset      = 0;
    self.scroll_top  = 0;



    self._setupEvents = function(){

        $(document).on('click','.'+self.config.class.link, function(e){

            if( $(this).attr('href').indexOf('http') == -1 ) {

                e.preventDefault();

                var target   = self.config.user_anchor ? $(this).attr('href') : $(this).data('ux-href');
                var duration = $(this).hasDataAttr('scroll-duration') ? $(this).data('scroll-duration') : false;

                self.scrollTo(target, true, duration);
            }
        });

        $(window).scroll(self._setActive).resize(self._resize);
    };


    self.scrollTo = function(id, animate, duration){

        var target = 0;

        if( $(id).length )
            target = $(id).offset().top;
        else if( id == "#top" )
            target = 0;
        else if( id == "#next" )
            target = $(window).height();
        else {

            $(document).trigger('ux-scroll', [id, false]);
            return;
        }

        var scroll_to = target - self._computeOffset();

        $(document).trigger('ux-scroll', [id, target]);

        if( animate ){

            if( typeof duration == 'undefined' || !duration ){

                var scroll_diff = Math.abs(self.scroll_top - scroll_to);
                var velocity    = Math.sqrt(scroll_diff/$(window).height());
                duration        = Math.max( self.config.speed, velocity*self.config.speed);

            }else{

                duration = parseInt(duration);
            }

            $('html, body').stop().animate({scrollTop:scroll_to}, duration, self.config.easeInOut, function(){

                $(document).trigger('ux-scroll');
            });
        }
        else{

            window.scrollTo(0, scroll_to );
        }
    };


    self._computeOffset = function(){

        if( self.config.force_offset ){

            self.offset = self.config.force_offset;
            return self.config.force_offset;
        }

        var $offset = $('.'+self.config.class.offset);
        var offset  = 0;

        $offset.each(function(){

            if( $(this).is(':visible') && ($(this).css('position') == "fixed"||$(this).css('position') == "absolute") && $(this).css('transform') == "none" )
                offset += $(this).outerHeight();
        });

        self.offset = offset+self.config.offset;

        return self.offset;
    };



    self._setActive = function(){

        self.scroll_top = $(window).scrollTop() + self.offset;

        for (var i in self.targets) {

            var target = self.targets[i];

            if( target.top <= self.scroll_top ){

                if( !target.seen ){

                    target.$link.addClass(self.config.class.link+'--seen');
                    target.$.addClass(self.config.class.link+'--seen ');
                    target.seen = true;
                }
            }
            else if( target.seen ){

                target.$link.removeClass(self.config.class.link+'--seen');
                target.$.removeClass(self.config.class.link+'--seen ');
                target.seen = false;
            }

            if( target.top <= self.scroll_top && target.bottom > self.scroll_top ){

                if( !target.active ){

                    target.$link.addClass(self.config.class.link+'--active');
                    target.$.addClass(self.config.class.link+'--active ');
                    target.active = true;
                }
            }
            else if( target.active ){

                target.$link.removeClass(self.config.class.link+'--active');
                target.$.removeClass(self.config.class.link+'--active ');
                target.active = false;
            }
        }
    };



    self.add = function( elem ){

        var raw_target  = self.config.user_anchor ? elem.attr('href') : elem.data('ux-href');

        if( !raw_target || !raw_target.length )
            return;

        var target  = raw_target.split('#');
        var current = window.location.href.split('#');

        if( target[0].length && target[0] != current[0] ){

            elem.removeClass('ux-scroll');
            return;
        }
        else{

            if( self.config.user_anchor )
                elem.attr('href', '#'+target[1]);
        }

        var element = {
            anchor   : self.config.user_anchor ? elem.attr('href') : elem.data('ux-href'),
            $link    : elem,
            seen     : false,
            current  : false
        };

        element.$ = $(element.anchor);

        if( element.$.length ){

            element.$.addClass(self.config.class.target);

            element.bottom =  element.top+element.$.height();
            element.bottom =  element.top+element.$.height();

            self.targets.push(element);
        }

    };



    self._resize = function(){

        for (var i=0; i< self.targets.length; i++) {

            var target    = self.targets[i];

            target.top    = target.$.offset().top;
            target.bottom = target.top+target.$.height();
        }

        self._computeOffset();
        self._setActive();
    };




    self._handleHash = function(){

        $(window).on('hashchange', function(e){

            if( window.location.hash.indexOf('#/') == -1 && !window.location.hash.match(/^#!?\//) ){

                var $target = $(window.location.hash);

                if( $target.length && $target.hasClass(self.config.class.target) ){

                    e.preventDefault();

                    //self.scrollTo(window.location.hash, false);
                    setTimeout(function(){ self.scrollTo(window.location.hash, true) });
                }
            }
        })
    };


    /* Contructor. */

    /**
     *
     */
    self.__construct = function() {

        if( window.precompile )
            return;

        $('.'+self.config.class.link).initialize(function(){
            self.add($(this))
        });

        $(document).on('boot', function(){

            self._handleHash();
        });

        $(document).on('loaded', function(){

            self._computeOffset();
            self.scroll_top = self.offset;

            self._resize();

            $(window).trigger('hashchange');
        });

        self._setupEvents();
    };



    if( typeof DOMCompiler !== "undefined" ) {

        dom.compiler.register('attribute', 'scroll-to', function(elem, attrs) {

            if( attrs.scrollTo.indexOf('http') != -1 ){

                elem.attr('href', attrs.scrollTo);
            }
            else{

                elem.addClass(self.config.class.link);

                if( self.config.user_anchor )
                    elem.attr('href', '#'+attrs.scrollTo);
                else
                    dom.compiler.attr(elem, 'ux-href', '#'+attrs.scrollTo);
            }

            if( 'scrollDuration' in attrs ){

                dom.compiler.attr(elem, 'scroll-duration', attrs.scrollDuration);
                elem.removeAttr('scroll-duration');
            }
        });

        dom.compiler.register('attribute', 'fixed-header', function(elem, attrs) {

            elem.addClass(self.config.class.offset);
        });
    }


    self.__construct();
};


var ux = ux || {};
ux.scroll = new UXScroll();
