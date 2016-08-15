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
            offset : 'ui-scroll-offset',
            target : 'ui-scroll--target'
        },
        force_offset : false,
        user_anchor  : false
    };

    that.targets     = [];
    that.offset      = 0;
    that.scroll_top  = 0;



    that._setupEvents = function(){

        $(document).on('click','.'+that.config.class.link, function(e){

            e.preventDefault();

            var target = that.config.user_anchor ? $(this).attr('href') : $(this).data('ui-href');
            that.scrollTo(target, true);
        });

        $(window).scroll(that._setActive).resize(that._resize);
    };


    that.scrollTo = function(id, animate){

        var target = 0;

        if( $(id).length )
            target = $(id).offset().top;
        else if( id == "#top" )
            target = 0;
        else if( id == "#next" )
            target = $(window).height();
        else
        {
            $(document).trigger('ui-scroll', [id, false]);
            return;
        }

        var scroll_to = target - that._computeOffset();

        $(document).trigger('ui-scroll', [id, target]);

        if( animate ){

            var scroll_diff = Math.abs(that.scroll_top - scroll_to);
            var velocity    = Math.sqrt(scroll_diff/$(window).height());

            $('html, body').stop().animate({scrollTop:scroll_to}, Math.max(200, velocity*that.config.speed), that.config.easeInOut, function(){

                $(document).trigger('ui-scroll');
            });
        }
        else{

            window.scrollTo(0, scroll_to );
        }
    };


    that._computeOffset = function(){

        if( that.config.force_offset ){

            that.offset = that.config.force_offset;
            return that.config.force_offset;
        }

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

            if( target.top <= that.scroll_top && target.bottom > that.scroll_top ){

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

        var raw_target  = that.config.user_anchor ? elem.attr('href') : elem.data('ui-href');

        if( !raw_target || !raw_target.length )
            return;

        var target  = raw_target.split('#');
        var current = window.location.href.split('#');

        if( target[0].length && target[0] != current[0] ){

            elem.removeClass('ui-scroll');
            return;
        }
        else{

            if( that.config.user_anchor )
                elem.attr('href', '#'+target[1]);
        }

        var element = {
            anchor  : that.config.user_anchor ? elem.attr('href') : elem.data('ui-href'),
            $link   : elem,
            seen    : false,
            current : false
        };

        element.$ = $(element.anchor);

        if( element.$.length ){

            element.$.addClass(that.config.class.target);

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

        $(window).on('hashchange', function(e){

            if( window.location.hash.indexOf('#/') == -1 && !window.location.hash.match(/^#!?\//) ){

                var $target = $(window.location.hash);

                if( $target.length && $target.hasClass(that.config.class.target) ){

                    e.preventDefault();

                    //that.scrollTo(window.location.hash, false);
                    setTimeout(function(){ that.scrollTo(window.location.hash, true) });
                }
            }
        })
    };


    /* Contructor. */

    /**
     *
     */
    that.__construct = function () {

        $('.'+that.config.class.link).initialize(function(){
            that.add($(this))
        });

        $(document).on('boot', function(){

            that._handleHash();
        });

        $(document).on('loaded', function(){

            that._computeOffset();
            that.scroll_top = that.offset;

            that._resize();

            $(window).trigger('hashchange');
        });

        that._setupEvents();
    };



    if( typeof DOMCompiler !== "undefined" ) {

        dom.compiler.register('attribute', 'scroll-to', function (elem, attrs) {

            elem.addClass(that.config.class.link);

            if( that.config.user_anchor )
                elem.attr('href', '#'+attrs.scrollTo);
            else
                dom.compiler.attr(elem, 'ui-href', '#'+attrs.scrollTo);
        });

        dom.compiler.register('attribute', 'fixed-header', function (elem, attrs) {

            elem.addClass(that.config.class.offset);
        });
    }


    that.__construct();
};


var ui = ui || {};
ui.scroll = new UIScroll();
