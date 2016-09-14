/**
 * Slider
 *
 * Copyright (c) 2014 - Metabolism
 * Author:
 *   - Jérome Barbato <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 2.1
 *
 * Changelog
 * v2.0
 * css animations only, removed IE9 compat
 *
 * Requires:
 *   - jQuery
 *
 **/

var UISlider = function (config) {

    var that = this;

    /* Contructor. */

    /**
     *
     */
    that.__construct = function (config) {

        that.config = $.extend(that.config, config);

        if( isNaN(parseInt(that.config.start_slide)) )
            that.config.start_slide = 0;
        else
            that.config.start_slide = parseInt(that.config.start_slide);

        that._setupContext(config);
        that._setupEvents();
    };


    /* Public */

    that.config = {
        $element       : false,
        autoplay       : false,
        hold           : true,
        animation      : 'horizontal',
        start_slide    : 0,
        swipe_tablet   : true,
        swipe_mobile   : true,
        swipe_desktop  : true,
        preload        : true,
        loop           : true,
        sync           : false,
        load           : 1.9,
        use_transition : Modernizr && Modernizr.csstransitions,
        animationEnd   : 'animationend oanimationend webkitAnimationEnd MSAnimationEnd'
    };


    that.context = {
        indices           : { current : -1 },
        is_animating      : false,
        is_visible        : false,
        interval          : false,
        count             : false,
        loop              : 0,
        window_height     : 0,
        $window           : false
    };


    that.classnames = {
        slider     : 'ui-slider',
        slides     : 'ui-slider__slides',
        slide      : 'ui-slider__slide',
        pagination : 'ui-slider__pagination',
        arrows     : 'ui-slider__arrows',
        arrow      : 'ui-slider__arrow',
        preload    : 'ui-slider__preload',
        scroller   : 'ui-slider__scroller'
    };



    /* Public */

    that.goto = function(id, animate, callback){

        that._show(id, animate, callback);
    };



    /* Private. */



    that._addClass    = function( $element, element){ if($element) $element.addClass(that.classnames[element]) };
    that._removeClass = function( $element, element){ if($element) $element.removeClass(that.classnames[element]) };
    that._addMod      = function( $element, element, mod){ if($element) $element.addClass(that.classnames[element]+'--'+mod) };
    that._removeMod   = function( $element, element, mod){ if($element) $element.removeClass(that.classnames[element]+'--'+mod) };
    that._alterMod    = function( $element, element, mod){ if($element) $element.alterClass(that.classnames[element]+'--'+(mod?mod:'')+'*') };



    /**
     *
     */
    that._setupContext = function () {

        that.context.$slides_container     = that.config.$element.findClosest('.'+that.classnames.slides, '.'+that.classnames.slider);
        that.context.$slides               = that.context.$slides_container.findClosest('.'+that.classnames.slide, '.'+that.classnames.slider);
        that.context.$pagination_container = that.config.$element.findClosest('.'+that.classnames.pagination, '.'+that.classnames.slider);
        that.context.$pagination           = that.context.$pagination_container.find('> a');
        that.context.$arrows_container     = that.config.$element.findClosest('.'+that.classnames.arrows, '.'+that.classnames.slider);
        that.context.$arrows               = that.context.$arrows_container.find('.'+that.classnames.arrow);
        that.context.slide_count           = that.context.$slides.length;
        that.context.offset                = that.config.$element.offset().top;
        that.context.$window               = $(window);
        that.context.window_height         = that.context.$window.height();

        if (!that.context.slide_count)
            return false;

        that.config.$element.addClass('ui-preload');

        that._addMod(that.config.$element, 'slider', 'initialised');
        that._addMod(that.config.$element, 'slider', 'animation-'+that.config.animation);

        that.context.$slides_container.wrap('<div class="'+that.classnames.scroller+'"/>');

        if (that.context.slide_count < 2)
            that.context.$arrows_container.hide();


        if( that.config.preload )
            that.config.$element.append('<div class="'+that.classnames.preload+'"/>');

        that._sync();
        that._initArrows();
        that._initPagination();
        that._show(Math.min(that.context.slide_count, that.config.start_slide), false);
        that._preload();
        that._startAutoplay();
    };



    that._sync = function(){

        $(document).on('ui-slider.updated', function(e, slideId, index){

            if( slideId == that.config.sync && index != that.context.indices.current )
                that._show(index, true);
        });
    };



    that._startAutoplay = function () {

        if ( !that.config.autoplay || that.config.autoplay < 500 || that.context.slide_count < 2 )
            return;

        if (that.context.interval)
            clearInterval(that.context.interval);

        that.context.interval = setInterval(function () {

            if( that.context.is_visible )
                that._show(that.context.indices.current + 1, true);

        }, that.config.autoplay);

    };



    that._setupEvents = function () {

        if (that.config.autoplay && that.config.hold) {

            that.config.$element.hover(function () {

                clearInterval(that.context.interval);

            }, function () {

                that._startAutoplay();
            });
        }

        if ( $.isFunction($.fn.swipe) && that.context.slide_count > 1 &&
            ( (that.config.swipe_desktop && browser.desktop)
            || (that.config.swipe_tablet && browser.tablet)
            || (that.config.swipe_mobile && browser.mobile && !browser.tablet) )
        ) {

            that.config.$element.swipe({

                swipeLeft: function () {
                    that._show(that.context.indices.current + 1, true)
                },
                swipeRight: function () {
                    that._show(that.context.indices.current - 1, true)
                }
            });
        }

        that.context.$window
            .resize(that._computeOffset)
            .scroll(that._preload)
            .scroll(that._checkVisibility);

        $(document).on('loaded', that._computeOffset);
    };



    that._computeOffset = function(){

        that.context.offset        = that.config.$element.offset().top;
        that.context.window_height = that.context.$window.height();

        that._checkVisibility();
    };



    that._checkVisibility = function(){

        var scrollTop    = that.context.$window.scrollTop();
        var targetScroll = scrollTop+that.context.window_height*0.8;
        var is_visible   = that.context.offset <= targetScroll;

        if( is_visible && !that.context.is_visible ){

            clearInterval(that.context.interval);
            that._startAutoplay();
        }

        that.context.is_visible = is_visible;
    };



    that._computeIndexes = function(target){

        var direction  = that.context.indices.current > target ? 'left' : 'right';
        var next       = direction == 'left' ? target - 1 : target + 1;
        var current    = that.context.indices.current;

        if( that.config.loop ){

            if ( target >= that.context.slide_count ) {

                target      = 0;
                direction  = 'right';

            } else if ( target < 0 ) {

                target      = that.context.slide_count - 1;
                direction  = 'left';
            }

            next = direction == 'left' ? target - 1 : target + 1;

            if( next >= that.context.slide_count )
                next = 0;
            else if ( next < 0 )
                next = that.context.slide_count - 1;
        }
        else {

            if (target >= that.context.slide_count || target < 0)
                return false;
        }

        that._alterMod(that.config.$element, 'slider', 'direction');
        that._addMod(that.config.$element, 'slider', 'direction-' + (direction=='right'?'forward':'backward'));

        that.context.direction        = direction;
        that.context.indices.current  = target;
        that.context.indices.next     = next;
        that.context.indices.previous = current;

        return true;
    };



    that._show = function (index, animate, callback) {

        if (that.context.is_animating || that.context.indices.current == index ) return;

        if( !that._computeIndexes(index) )
            return false;

        that.context.is_animating = true;

        $(document).trigger('ui-slider.updated', [that.config.$element.attr('id'), index, that.context.indices.current]);

        that.context.$current_slide = that.context.$slides.eq(that.context.indices.current);

        if( that.context.indices.next >= 0 && that.context.indices.next < that.context.slide_count )
            that.context.$next_slide = that.context.$slides.eq(that.context.indices.next);
        else
            that.context.$next_slide = false;

        if( that.context.indices.previous >= 0 && that.context.indices.previous < that.context.slide_count )
            that.context.$previous_slide = that.context.$slides.eq(that.context.indices.previous);
        else
            that.context.$previous_slide = false;

        that._removeMod(that.context.$arrows, 'arrow', 'disabled');

        if ( that.context.indices.current >= that.context.slide_count-1 && !that.config.loop )
            that._addMod(that.context.$arrows.filter(that.classnames.arrow+'--right'), 'arrow', 'disabled');

        if( that.context.indices.current == 0 && !that.config.loop )
            that._addMod(that.context.$arrows.filter(that.classnames.arrow+'--left'), 'arrow', 'disabled');

        that._updateSlides(animate, callback);
        that._updatePagination();

        that.context.loop++;
    };



    that._updateSlides = function (animate, callback) {

        that._alterMod(that.context.$slides, 'slide');

        if( that.context.$previous_slide )
            that._addMod(that.context.$previous_slide, 'slide', 'previous');

        that._addMod(that.context.$current_slide, 'slide', 'current');

        if( that.context.$next_slide )
            that._addMod(that.context.$next_slide, 'slide', 'next');

        if( window.jQuery.fn.fit ){

            setTimeout(function(){

                that.context.$current_slide.find('.ui-fit__cover, .ui-fit__contain').fit();
                that.context.$next_slide.find('.ui-fit__cover, .ui-fit__contain').fit();
            },10);
        }

        that._animate(animate, function () {

            that.context.is_animating = false;

            that._preload();

            if( callback )
                callback();
        });
    };



    that._animate = function(animate, callback){

        if( animate ){

            if( !that.context.loop )
                callback();
            else
                that._addMod(that.config.$element, 'slider', 'animating');

            var $animatedSlides  = that.context.$slides.filter(':visible').not(function(){

                var animation = $(this).css('animation-name');
                return !animation || animation == "none";
            });

            var i = 0;

            $animatedSlides.one(that.config.animationEnd, function(){

                i++;
                if( i == $animatedSlides.length ){

                    that._removeMod(that.config.$element, 'slider', 'animating');
                    callback();
                }
            });

            if( !that.config.use_transition ){
                that._removeMod(that.config.$element, 'slider', 'animating');
                callback();
            }
        }
        else{

            callback();
        }
    };



    that._updatePagination = function () {

        that.context.$pagination.removeClass('active');

        if ( that.context.indices.current >= 0 )
            that.context.$pagination.eq(that.context.indices.current).addClass('active');
    };



    that._initArrows = function () {

        if (!that.context.$arrows.length && that.context.slide_count > 1) {

            that.context.$arrows_container.append('<a class="'+that.classnames.arrow+' '+that.classnames.arrow+'--right"></a>');
            that.context.$arrows_container.prepend('<a class="'+that.classnames.arrow+' '+that.classnames.arrow+'--left"></a>');

            that.context.$arrows = that.context.$arrows_container.find('.'+that.classnames.arrow);
        }

        that.context.$arrows.click(function (e) {

            e.preventDefault();

            var inc = $(this).hasClass(that.classnames.arrow+'--left') ? -1 : 1;
            that._show(that.context.indices.current + inc, true);
        });
    };



    that._preload = function () {

        var scrollTop    = that.context.$window.scrollTop();
        var targetScroll = scrollTop+that.context.window_height;

        if (that.config.preload && that.context.offset <= targetScroll*that.config.load) {

            that._loadImage(that.context.$current_slide);

            if( that.context.$next_slide && that.context.offset <= targetScroll*that.config.load ){

                that._loadImage(that.context.$next_slide);

                if( that.config.preload > 1 ){

                    var $next = that.context.$next_slide.next();

                    if( $next.length )
                        that._loadImage($next);
                }
            }

            if( that.config.loop && that.context.$previous_slide && that.context.offset <= targetScroll*that.config.load )
                that._loadImage(that.context.$previous_slide);
        }
    };


    that._loadImage = function ($slide) {

        if (!$slide || !$slide.length)
            return false;

        $slide.find('.ui-on-demand').not('.ui-on-demand--loaded').each(function () {

            var $element = $(this);

            //force load to memory
            if( Modernizr && Modernizr.csstransforms3d )
                that.config.$element.find('.'+that.classnames.preload).append('<img src="'+$element.data('src')+'"/>');

            if( $element.is('img') )
                $element.attr('src', $element.data('src'));
            else
                $element.css('backgroundImage', "url('" + $element.data('src') + "')");

            $element.addClass('ui-on-demand--loaded');
        });

        return true;
    };


    that._initPagination = function () {

        if (!that.context.$pagination.length &&that.context.slide_count > 1) {

            var a = '<a></a>';
            var $pagination = that.config.$element.findClosest('.'+that.classnames.pagination, '.'+that.classnames.slider);

            $pagination.append(a.repeat(that.context.slide_count));

            that.context.$pagination = $pagination.find('> a');
        }

        that.context.$pagination.click(function (e) {

            e.preventDefault();
            that._show($(this).index(), true);
        });

        that._updatePagination();
    };


    that.__construct(config);
};


/*
 Sliders Mananger
 */
var UISliders = function () {

    var that = this;

    that.sliders = {};

    that.init = function () {

        $('.ui-slider').each(function () {

            that.add( $(this) );
        });
    };


    that.add = function($slider){

        if ($slider.data('ui-slider--initialised') !== true) {

            if( $slider.attr('id') == undefined )
                $slider.attr('id', guid('slider'));

            $slider.data('ui-slider--initialised', true);

            var context = $slider.data('context') ? JSON.parse('{' + $slider.data('context').replace(/'/g, '"') + '}') : {};
            context.$element = $slider;

            $slider.removeAttr('data-context');

            that.sliders[$slider.attr('id')] = new UISlider(context);
        }
    };


    that.goto = function(sliderId, slideId, animate, callback){

        if( that.sliders[sliderId] ){

            var slider = that.sliders[sliderId];

            slider.goto(slideId, animate, callback)
        }
    };


    that.__construct = function () {

        $(document).on('boot', that.init);
    };


    if( typeof DOMCompiler !== "undefined" ) {

        dom.compiler.register('element', 'ui-slider', function (elem, attrs) {

            return '<div class="ui-slider"'+(attrs.context?' data-context="'+attrs.context+'"':'')+'><transclude/></div>';
        });

        dom.compiler.register('element', 'slides', function (elem) {

            return '<div class="ui-slider__slides"><transclude/></div>';
        });

        dom.compiler.register('element', 'slide', function (elem) {

            return '<div class="ui-slider__slide"><transclude/></div>';
        });

        dom.compiler.register('attribute', 'slide-item', function (elem, attrs) {

            elem.addClass('ui-slider__slide__item');
        });

        dom.compiler.register('element', 'arrows', function (elem) {

            return '<div class="ui-slider__arrows"><transclude/></div>';
        });

        dom.compiler.register('element', 'pagination', function (elem) {

            return '<div class="ui-slider__pagination"><transclude/></div>';
        });

        dom.compiler.register('element', 'arrow-left', function (elem) {

            return '<a class="ui-slider__arrow ui-slider__arrow--left"><transclude/></a>';
        });

        dom.compiler.register('element', 'arrow-right', function (elem) {

            return '<a class="ui-slider__arrow ui-slider__arrow--right"><transclude/></a>';
        });
    }


    that.__construct();
};

var ui = ui || {};
ui.sliders = new UISliders();
