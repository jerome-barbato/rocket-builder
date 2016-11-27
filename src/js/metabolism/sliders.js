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
 * v2.1
 * renamed ux-slider to ux-slider
 *
 * Requires:
 *   - jQuery
 *
 **/

var UXSlider = function(config) {

    var self = this;

    /* Contructor. */

    /**
     *
     */
    self.__construct = function(config) {

        self.config = $.extend(self.config, config);

        if( isNaN(parseInt(self.config.start_slide)) )
            self.config.start_slide = 0;
        else
            self.config.start_slide = parseInt(self.config.start_slide);

        self._setupContext(config);
        self._setupEvents();
    };


    /* Public */

    self.config = {
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
        display           : false
    };


    self.context = {
        indices           : { current : -1 },
        is_animating      : false,
        is_visible        : false,
        timer             : false,
        count             : false,
        loop              : 0,
        paused            : false,
        window_height     : 0,
        $window           : false,
        animationEnd   : 'animationend.ux-slider oanimationend.ux-slider webkitAnimationEnd.ux-slider MSAnimationEnd.ux-slider'
    };


    self.classnames = {
        slider     : 'ux-slider',
        slides     : 'ux-slider__slides',
        slide      : 'ux-slider__slide',
        pagination : 'ux-slider__pagination',
        arrows     : 'ux-slider__arrows',
        arrow      : 'ux-slider__arrow',
        preload    : 'ux-slider__preload',
        scroller   : 'ux-slider__scroller'
    };



    /* Public */

    self.goto = function(id, animate, callback){

        self._show(id, animate, callback);
    };


    self.pause = function(){ self.context.paused = true };
    self.resume = function(){ self.context.paused = false };



    /* Private. */



    self._addClass    = function( $element, element){ if($element) $element.addClass(self.classnames[element]) };
    self._removeClass = function( $element, element){ if($element) $element.removeClass(self.classnames[element]) };
    self._addMod      = function( $element, element, mod){ if($element) $element.addClass(self.classnames[element]+'--'+mod) };
    self._removeMod   = function( $element, element, mod){ if($element) $element.removeClass(self.classnames[element]+'--'+mod) };
    self._alterMod    = function( $element, element, mod){ if($element) $element.alterClass(self.classnames[element]+'--'+(mod?mod:'')+'*') };



    /**
     *
     */
    self._setupContext = function() {

        self.context.$slides_container     = self.config.$element.findClosest('.'+self.classnames.slides, '.'+self.classnames.slider);
        self.context.$slides               = self.context.$slides_container.findClosest('.'+self.classnames.slide, '.'+self.classnames.slider);
        self.context.$pagination_container = self.config.$element.findClosest('.'+self.classnames.pagination, '.'+self.classnames.slider);
        self.context.$pagination           = self.context.$pagination_container.find('> a');
        self.context.$arrows_container     = self.config.$element.findClosest('.'+self.classnames.arrows, '.'+self.classnames.slider);
        self.context.$arrows               = self.context.$arrows_container.find('.'+self.classnames.arrow);
        self.context.slide_count           = self.context.$slides.length;
        self.context.offset                = self.config.$element.offset().top;
        self.context.$window               = $(window);
        self.context.window_height         = self.context.$window.height();

        if (!self.context.slide_count)
            return false;

        self._packSlides();

        self.config.$element.addClass('ux-preload');

        self._addMod(self.config.$element, 'slider', 'animation-'+self.config.animation);

        self.context.$slides_container.wrap('<div class="'+self.classnames.scroller+'"/>');

        if (self.context.slide_count < 2)
            self.context.$arrows_container.hide();


        if( self.config.preload )
            self.config.$element.append('<div class="'+self.classnames.preload+'"/>', false);

        self._sync();
        self._initArrows();
        self._initPagination();
        self._preload();

        setTimeout(function(){ self.config.$element.addClass('ux-slider--loaded') });

        $(window).load(function(){

            self._show(Math.min(self.context.slide_count, self.config.start_slide), false);
        });
    };


    self._packSlides = function(){

        if( self.config.display ){

            $.each(['desktop','mobile','tablet','phone'], function(i, device){

                if ( self.config.display[device] && self.config.display[device] > 1 && browser[device]) {

                    for (var j = 0; j < self.context.$slides.length; j += self.config.display[device])
                        self.context.$slides.slice(j, j + self.config.display[device]).wrapAll("<div class='ux-slider__slide'></div>").children().unwrap();
                }
            });

            self.context.$slides = self.context.$slides_container.findClosest('.'+self.classnames.slide, '.'+self.classnames.slider);
            self.context.slide_count = self.context.$slides.length;
        }
    };



    self._sync = function(){

        $(document).on('ux-slider.updated', function(e, slideId, index){

            if( slideId == self.config.sync && index != self.context.indices.current )
                self._show(index, true);
        });
    };



    self._autoplay = function() {

        if ( !self.config.autoplay || self.config.autoplay < 500 || self.context.slide_count < 2 )
            return;

        clearTimeout(self.context.timer);

        self.context.timer = setTimeout(function() {

            if( self.context.is_visible )
                self._show(self.context.indices.current + 1, true);

        }, self.config.autoplay);

    };



    self._setupEvents = function() {

        if ( self.config.autoplay && self.config.hold )
            self.config.$element.hover(function() { self.pause() }, function() { self.resume() });

        if ( $.isFunction($.fn.swipe) && self.context.slide_count > 1 &&
            ( (self.config.swipe_desktop && browser.desktop)
            || (self.config.swipe_tablet && browser.tablet)
            || (self.config.swipe_mobile && browser.mobile && !browser.tablet) )
        ) {

            self.config.$element.swipe({

                swipeLeft: function() {
                    self._show(self.context.indices.current + 1, true)
                },
                swipeRight: function() {
                    self._show(self.context.indices.current - 1, true)
                }
            });
        }

        self.context.$window
            .resize(self._computeOffset)
            .scroll(self._preload)
            .scroll(self._checkVisibility);

        $(document).on('loaded', self._computeOffset);
    };



    self._computeOffset = function(){

        self.context.offset        = self.config.$element.offset().top;
        self.context.window_height = self.context.$window.height();

        self._checkVisibility();
    };



    self._checkVisibility = function(){

        var scrollTop    = self.context.$window.scrollTop();
        var targetScroll = scrollTop+self.context.window_height*0.8;
        var is_visible   = self.context.offset <= targetScroll;

        if( is_visible && !self.context.is_visible )
            self._autoplay();

        self.context.is_visible = is_visible;
    };



    self._computeIndexes = function(target){

        var direction  = self.context.indices.current > target ? 'left' : 'right';
        var next       = direction == 'left' ? target - 1 : target + 1;
        var current    = self.context.indices.current;

        if( self.config.loop ){

            if ( target >= self.context.slide_count ) {

                target      = 0;
                direction  = 'right';

            } else if ( target < 0 ) {

                target      = self.context.slide_count - 1;
                direction  = 'left';
            }

            next = direction == 'left' ? target - 1 : target + 1;

            if( next >= self.context.slide_count )
                next = 0;
            else if ( next < 0 )
                next = self.context.slide_count - 1;
        }
        else {

            if (target >= self.context.slide_count || target < 0)
                return false;
        }

        self._alterMod(self.config.$element, 'slider', 'direction');
        self._addMod(self.config.$element, 'slider', 'direction-' + (direction=='right'?'forward':'backward'));
        self._alterMod(self.config.$element, 'slider', 'index');
        self._addMod(self.config.$element, 'slider', 'index-' + (parseInt(target)+1));

        self.context.direction        = direction;
        self.context.indices.current  = target;
        self.context.indices.next     = next;
        self.context.indices.previous = current;

        return true;
    };



    self._show = function(index, animate, callback) {

        clearTimeout(self.context.timer);

        if (self.context.is_animating || self.context.indices.current == index ) return;

        if( !self._computeIndexes(index) )
            return false;

        self.context.is_animating = true;

        $(document).trigger('ux-slider.updated', [self.config.$element.attr('id'), index, self.context.indices.current]);

        self.context.$current_slide = self.context.$slides.eq(self.context.indices.current);

        if( self.context.indices.next >= 0 && self.context.indices.next < self.context.slide_count )
            self.context.$next_slide = self.context.$slides.eq(self.context.indices.next);
        else
            self.context.$next_slide = false;

        if( self.context.indices.previous >= 0 && self.context.indices.previous < self.context.slide_count )
            self.context.$previous_slide = self.context.$slides.eq(self.context.indices.previous);
        else
            self.context.$previous_slide = false;

        self._removeMod(self.context.$arrows, 'arrow', 'disabled');

        if ( self.context.indices.current >= self.context.slide_count-1 && !self.config.loop )
            self._addMod(self.context.$arrows.filter(self.classnames.arrow+'--right'), 'arrow', 'disabled');

        if( self.context.indices.current == 0 && !self.config.loop )
            self._addMod(self.context.$arrows.filter(self.classnames.arrow+'--left'), 'arrow', 'disabled');

        self._updateSlides(animate, callback);
        self._updatePagination();

        self.context.loop++;
    };



    self._updateSlides = function(animate, callback) {

        self._alterMod(self.context.$slides, 'slide');

        if( self.context.$previous_slide )
            self._addMod(self.context.$previous_slide, 'slide', 'previous');

        self._addMod(self.context.$current_slide, 'slide', 'current');

        if( self.context.$next_slide )
            self._addMod(self.context.$next_slide, 'slide', 'next');

        if( window.jQuery.fn.fit ){

            self.context.$current_slide.find('.ux-fit__object').fit();

            if( self.context.$next_slide )
                self.context.$next_slide.find('.ux-fit__object').fit();
        }

        self._animate(animate, function() {

            self.context.is_animating = false;

            self._preload();
            self._autoplay();

            if( callback )
                callback();
        });
    };



    self._animate = function(animate, callback){

        if( animate ){

            if( !self.context.loop )
                callback();
            else
                self._addMod(self.config.$element, 'slider', 'animating');

            var $animatedSlides  = self.context.$slides.filter(':visible').not(function(){

                var animation = $(this).css('animation-name');
                return !animation || animation == "none";
            });

            var i = 0;

            $animatedSlides.one(self.context.animationEnd, function(){

                i++;
                if( i == $animatedSlides.length ){

                    $animatedSlides.off(self.context.animationEnd);
                    self._removeMod(self.config.$element, 'slider', 'animating');
                    callback();
                }
            });

            if( !self.config.use_transition || !$animatedSlides.length){

                self._removeMod(self.config.$element, 'slider', 'animating');
                callback();
            }
        }
        else{

            callback();
        }
    };



    self._updatePagination = function() {

        self.context.$pagination.removeClass('active');

        if ( self.context.indices.current >= 0 )
            self.context.$pagination.eq(self.context.indices.current).addClass('active');
    };



    self._initArrows = function() {

        if (!self.context.$arrows.length && self.context.slide_count > 1) {

            self.context.$arrows_container.append('<a class="'+self.classnames.arrow+' '+self.classnames.arrow+'--right"></a>', false);
            self.context.$arrows_container.prepend('<a class="'+self.classnames.arrow+' '+self.classnames.arrow+'--left"></a>', false);

            self.context.$arrows = self.context.$arrows_container.find('.'+self.classnames.arrow);
        }

        self.context.$arrows.on('click keypress', function(e) {

            if (e.which === 13 || e.type === 'click') {

                e.preventDefault();

                var inc = $(this).hasClass(self.classnames.arrow + '--left') ? -1 : 1;

                self._show(self.context.indices.current + inc, true);
            }
        });
    };



    self._preload = function() {

        var scrollTop    = self.context.$window.scrollTop();
        var targetScroll = scrollTop+self.context.window_height;

        if (self.config.preload && self.context.offset <= targetScroll*self.config.load) {

            self._loadImage(self.context.$current_slide);

            if( self.context.$next_slide && self.context.offset <= targetScroll*self.config.load ){

                self._loadImage(self.context.$next_slide);

                if( self.config.preload > 1 ){

                    var $next = self.context.$next_slide.next();

                    if( $next.length )
                        self._loadImage($next);
                }
            }

            if( self.config.loop && self.context.$previous_slide && self.context.offset <= targetScroll*self.config.load )
                self._loadImage(self.context.$previous_slide);
        }
    };


    self._loadImage = function($slide) {

        if (!$slide || !$slide.length)
            return false;

        $slide.find('.ux-on-demand').not('.ux-on-demand--loaded').each(function() {

            var $element = $(this);

            //force load to memory
            if( Modernizr && Modernizr.csstransforms3d )
                self.config.$element.find('.'+self.classnames.preload).append('<img src="'+$element.data('src')+'"/>', false);

            if( $element.is('img') )
                $element.attr('src', $element.data('src'));
            else
                $element.css('backgroundImage', "url('" + $element.data('src') + "')");

            $element.addClass('ux-on-demand--loaded');
        });

        return true;
    };


    self._initPagination = function() {

        if (!self.context.$pagination.length &&self.context.slide_count > 1) {

            var a = '<a></a>';
            var $pagination = self.config.$element.findClosest('.'+self.classnames.pagination, '.'+self.classnames.slider);

            $pagination.append(a.repeat(self.context.slide_count), false);

            self.context.$pagination = $pagination.find('> a');
        }

        self.context.$pagination.click(function(e) {

            e.preventDefault();
            self._show($(this).index(), true);
        });

        self._updatePagination();
    };


    self.__construct(config);
};


/*
 Sliders Mananger
 */
var UXSliders = function() {

    var self = this;

    self.sliders = {};


    self.add = function( $slider ){

        if( $slider.attr('id') == undefined )
            $slider.attr('id', guid('slider'));

        var context = {};

        try {
            context = $slider.data('context') ? JSON.parse('{' + $slider.data('context').replace(/'/g, '"') + '}') : {};
        } catch(e) {}

        context.$element = $slider;

        $slider.removeAttr('data-context');

        self.sliders[$slider.attr('id')] = new UXSlider(context);
    };


    self.goto = function(sliderId, slideId, animate, callback){

        if( self.sliders[sliderId] ){

            var slider = self.sliders[sliderId];

            slider.goto(slideId, animate, callback)
        }
    };


    self.pause = function(sliderId){

        if( self.sliders[sliderId] )
            self.sliders[sliderId].pause();
    };


    self.resume = function(sliderId){

        if( self.sliders[sliderId] )
            self.sliders[sliderId].resume();
    };


    self.__construct = function() {

        $('.ux-slider').initialize(function() {

            self.add( $(this) );
        });
    };


    if( typeof DOMCompiler !== "undefined" ) {

        dom.compiler.register('element', 'slider', function(elem, attrs) {

            return '<div class="ux-slider"'+(attrs.context?' data-context="'+attrs.context+'"':'')+'><transclude/></div>';

        }, self.add);

        dom.compiler.register('element', 'slides', function(elem) {

            return '<div class="ux-slider__slides"><transclude/></div>';
        });

        dom.compiler.register('element', 'slide', function(elem) {

            return '<div class="ux-slider__slide"><transclude/></div>';
        });

        dom.compiler.register('attribute', 'slide-item', function(elem, attrs) {

            elem.addClass('ux-slider__slide__item');
        });

        dom.compiler.register('element', 'arrows', function(elem) {

            return '<div class="ux-slider__arrows"><transclude/></div>';
        });

        dom.compiler.register('element', 'pagination', function(elem) {

            return '<div class="ux-slider__pagination"><transclude/></div>';
        });

        dom.compiler.register('element', 'arrow-left', function(elem) {

            return '<a class="ux-slider__arrow ux-slider__arrow--left"><transclude/></a>';
        });

        dom.compiler.register('element', 'arrow-right', function(elem) {

            return '<a class="ux-slider__arrow ux-slider__arrow--right"><transclude/></a>';
        });
    }


    self.__construct();
};

var ux = ux || {};
ux.sliders = new UXSliders();
