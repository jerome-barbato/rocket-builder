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

var UIScroll = function () {

    var that = this;

    that.config = {
        speed     : 500,
        easeIn    : 'easeOutCubic',
        easeOut   : 'easeInCubic',
        easeInOut : 'easeInOutCubic',
        offset    : 0,
        class     : {
            link   : 'ui-scroll',
            offset : 'ui-scroll-offset'
        },
        force_offset : {
            top  : false,
            down : false
        }
    };

    that.targets     = [];
    that.offset      = 0;
    that.scroll_top  = 0;



    that._setupEvents = function(){

        $(document).on('click','.'+that.config.class.link, function(e){

            e.preventDefault();

            var href        = $(this).attr('href');
            var target      = href != "#top" ? $(href).offset().top : 0;
            var direction   = target > that.scroll_top ? 'down' : 'top';

            var scroll_to   = target-(that.config.force_offset[direction]!==false?that.config.force_offset[direction]:that._computeOffset());

            var scroll_diff = Math.abs(that.scroll_top - scroll_to);
            var velocity    = Math.sqrt(scroll_diff/$(window).height());

            $('html, body').animate({scrollTop:scroll_to}, Math.max(200, velocity*that.config.speed), that.config.easeInOut, function(){

                $(document).trigger('ui-scroll');
            });
        });

        $(window).scroll(that._setActive).resize(that._resize);
    };



    that._computeOffset = function(){

        var $offset = $('.'+that.config.class.offset);
        var offset  = 0;

        $offset.each(function(){

            if( $(this).is(':visible') && ($(this).css('position') == "fixed"||$(this).css('position') == "absolute") && $(this).css('transform') == "none" )
                offset += $(this).outerHeight();
        });

        that.offset = offset+that.config.offset;

        return that.offset;
    };



    that._setActive = function(){

        that.scroll_top = $(window).scrollTop() + that.offset;

        for (var i in that.targets) {

            var target = that.targets[i];

            if( target.top <= that.scroll_top ){

                if( !target.seen ){

                    target.$link.addClass(that.config.class.link+'--seen');
                    target.$.addClass(that.config.class.link+'--seen ');
                    target.seen = true;
                }
            }
            else if( target.seen ){

                target.$link.removeClass(that.config.class.link+'--seen');
                target.$.removeClass(that.config.class.link+'--seen ');
                target.seen = false;
            }

            if( target.top <= that.scroll_top && target.bottom >= that.scroll_top ){

                if( !target.active ){

                    target.$link.addClass(that.config.class.link+'--active');
                    target.$.addClass(that.config.class.link+'--active ');
                    target.active = true;
                }
            }
            else if( target.active ){

                target.$link.removeClass(that.config.class.link+'--active');
                target.$.removeClass(that.config.class.link+'--active ');
                target.active = false;
            }
        }
    };



    that.add = function( elem ){

        var element = {
            anchor  : elem.attr('href'),
            $link   : elem,
            seen    : false,
            current : false
        };

        element.$ = $(element.anchor);

        if( element.$.length ){

            element.$.addClass('ui-scroll--target');

            element.bottom =  element.top+element.$.height();
            element.bottom =  element.top+element.$.height();

            that.targets.push(element);
        }

    };



    that._resize = function(){

        for (var i in that.targets) {

            var target    = that.targets[i];

            target.top    = target.$.offset().top;
            target.bottom = target.top+target.$.height();
        }

        that._computeOffset();
        that._setActive();
    };




    that._handleHash = function(){

        if( window.location.hash.length ){

            var count = 0;

            $(window).on('scroll.scrollTo', function(e) {

                var $target = $(window.location.hash);

                if( $target.length && $target.hasClass('ui-scroll--target') ){

                    e.preventDefault();
                    window.scrollTo(0, $target.offset().top-that._computeOffset());

                    if( count++ >=2 )
                        $(window).unbind("scroll.scrollTo");
                }
                else{

                    $(window).unbind("scroll.scrollTo");
                }
            });
        }

        $(window).on('hashchange', function(e){

            var $target = $(window.location.hash);

            if( $target.length && $target.hasClass('ui-scroll--target') ){

                e.preventDefault();
                window.scrollTo(0, $target.offset().top-that._computeOffset());
                setTimeout(function(){ window.scrollTo(0, $target.offset().top-that._computeOffset()) });
            }
        })
    };


    /* Contructor. */

    /**
     *
     */
    that.__construct = function () {
        
        $(document).on('boot', function(){

            $('.'+that.config.class.link).each(function(){
                that.add($(this))
            });

            that._handleHash();
        });

        $(document).on('loaded', function(){

            that._computeOffset();
            that.scroll_top = that.offset;

            that._resize();
            that._setupEvents();

            if( $(window).scrollTop() == 0 )
                $(window).trigger('scroll.scrollTo');
        });
    };



    if( typeof DOMCompiler !== "undefined" ) {

        dom.compiler.register('attribute', 'scroll-to', function (elem, attrs) {

            elem.addClass(that.config.class.link).attr('href', '#'+attrs.scrollTo);
        });

        dom.compiler.register('attribute', 'fixed-header', function (elem, attrs) {

            elem.addClass(that.config.class.offset);
        });
    }


    that.__construct();
};


var ui = ui || {};
ui.scroll = new UIScroll();
