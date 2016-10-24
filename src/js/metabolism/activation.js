/**
 * Activation
 *
 * Copyright (c) 2016 - Metabolism
 * Author:
 *   - Jérome Barbato <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 4.1
 *
 * Requires:
 *   - jQuery
 *
 **/

var UXActivation = function(){

    var self = this;


    /* Public */

    self.context = {
        hold          : false,
        window_height : 0,
        elements      : [],
        lang          : $('html').attr('lang'),
        animationEnd  : 'animationend.ux-activation oanimationend.ux-activation webkitAnimationEnd.ux-activation MSAnimationEnd.ux-activation'
    };


    self.config = {
        visibility  : 0.2,
        reverse     : true,
        debug       : false,
        tablet      : false,
        phone       : false
    };


    self.add = function( $element ){

        if( !$element || !$element.length )
            return;

        var element = self._add( $element );

        self._activate(element);
    };


    /* Private. */

    self._init = function(){

        if( Modernizr && Modernizr.csstransitions )
            self._scroll();
    };



    self._onAnimationEnded = function($element, callback){

        var $items = $element.find('[data-delay]');

        if( $items.length && $element.data('animation') == 'stack' ){

            var i = 0;

            $items.one(self.context.animationEnd, function(){

                i++;

                if( i == $items.length && callback )
                    callback();
            });
        }
        else{

            $element.one(self.context.animationEnd, function(){
                if( callback )
                    callback();
            });
        }
    };



    self._add = function($element){

        if( self.context.disable ){

            $element.removeAttr('data-animation').removeAttr('data-easing').removeAttr('data-delay');
            $element.find('[data-delay]').removeAttr('data-animation').removeAttr('data-easing').removeAttr('data-delay');
            $element.addClass('ux-activation--seen');
        }
        else{

            var element    = {
                $          : $element,
                top        : $element.offset().top,
                visibility : parseFloat($element.data('visibility')) || self.config.visibility,
                active     : false,
                animation  : $element.data('animation'),//todo: handle tablet and mobile animation
                delay      : $element.data('delay'),
                increment  : $element.data('animation') == 'increment'
            };

            var value = parseFloat( self.context.lang=='fr' ? $element.text().replace(/,/, '.') : $element.text().replace(/,/g, '') );

            if( element.increment && !isNaN(value) ){

                var is_int = parseInt( value ) === value;
                var init   =  is_int ? Math.round(value*0.5) : Math.round(value*5)/10;

                if( init < 50 )
                    init = 0;

                $element.text(init);

                element.value  = value;
                element.is_int = is_int;
                element.init   = init;
            }

            self.context.elements.push(element);

            return element;
        }

        return false;
    };



    self._setupEvents = function() {

        $(window)
            .scroll( self._scroll )
            .resize(function(){ self._recompute(); self._scroll() });
    };



    self._recompute = function(){

        self.context.window_height = $(window).height();

        $.each(self.context.elements, function(i, element){

            element.top = element.$.offset().top;
        });
    };



    self._decrement = function(element){

        var unit_decimal  = self.context.lang=='fr'?',':'.';
        var unit_thousand = self.context.lang=='fr'?' ':',';

        $({increment: element.value}).stop(true).animate({increment: element.init}, {
            duration : 1500,
            easing   : "easeOutCubic",
            step     : function() {

                var value = element.is_int ?
                    Math.round(this.increment).format(0).replace(/ /g, unit_thousand) :
                    (Math.round(this.increment*10)/10).format(1).replace('.', unit_decimal);

                element.$.text(value);
            }
        }, function() {

            element.$.text( element.is_int ? element.init.format(0).replace(/ /g, unit_thousand) : element.init.format(1).replace('.', unit_decimal) );
        });
    };



    self._increment = function(element){

        var unit_decimal  = self.context.lang=='fr'?',':'.';
        var unit_thousand = self.context.lang=='fr'?' ':',';

        $({increment: element.init}).stop(true).animate({increment: element.value}, {
            duration : 1500,
            easing   : "easeOutCubic",
            step     : function() {

                var value = element.is_int ?
                    Math.round(this.increment).format(0).replace(/ /g, unit_thousand) :
                    (Math.round(this.increment*10)/10).format(1).replace('.', unit_decimal);

                element.$.text(value);
            }
        }, function() {

            element.$.text( element.is_int ? element.value.format(0).replace(/ /g, unit_thousand) : element.value.format(1).replace('.', unit_decimal) );
        });
    };


    self._reset = function( element ){

        self._onAnimationEnded(element.$, function(){

            element.$.removeClass('ux-activation--reset');
        });

        element.$.attr('data-animation', element.animation).removeClass('ux-activation--active ux-activation--seen').addClass('ux-activation--reset');
        element.active = false;

        if( element.increment )
            self._decrement(element);
    };


    self._activate = function( element, scrollTop ) {

        if( !element )
            return;

        if( typeof scrollTop == "undefined")
            scrollTop = $(window).scrollTop() + self.context.window_height;

        if( element.active ) {

            if( self.config.reverse && element.top + self.context.window_height*element.visibility > scrollTop )
                self._reset( element );
        }
        else{

            if( scrollTop > element.top + self.context.window_height*element.visibility  ){

                self._onAnimationEnded(element.$, function(){

                    element.$.removeAttr('data-animation').removeClass('ux-activation--active');
                });

                element.$.removeClass('ux-activation--reset').addClass('ux-activation--active ux-activation--seen');

                element.active = true;

                if( element.increment )
                    self._increment(element);
            }
        }
    };

    self._scroll = function() {

        if( self.context.hold ) return;

        var scrollTop = $(window).scrollTop() + self.context.window_height;

        $.each(self.context.elements, function(index, element) {

            self._activate(element, scrollTop);
        });
    };


    self._addAttr = function(elem, value, id, name){

        if( typeof name == "undefined" )
            name = id;

        if( value.indexOf(':') > -1 && value.indexOf('{') == -1 ) {

            var values = {d:false, m:false, t:false};

            try { values = JSON.parse('{"' + value.replace(/ /g, '","').replace(/:/g, '":"') + '"}')} catch (e) {}

            if (values.d)
                elem.attr('data-'+name, values.d);

            if (values.m)
                elem.attr('data-mobile-'+name , values.m);

            if (values.t)
                elem.attr('data-tablet-'+name ,values.t);
        }
        else{

            elem.attr('data-'+name, value);
        }
    };


    /* Constructor. */

    /**
     *
     */
    self.__construct =  function() {

        self.context.disable = (browser.phone && !self.config.phone) || (browser.tablet && !self.config.tablet);

        $('.ux-activation').initialize(function() {

            self.add( $(this) );
        });

        $(document).on('loaded', function(){

            self._setupEvents();
            self._recompute();
            self._scroll();
        });
    };



    if( typeof DOMCompiler !== "undefined" ){

        dom.compiler.register('attribute', 'when-visible', function(elem, attrs) {

            elem.addClass('ux-activation');
            self._addAttr(elem, attrs.whenVisible, 'animation');

            if( attrs.whenVisible == 'stack' )
                elem.find('[delay],[data-delay]').not('[animation],[data-animation]').attr('data-animation', 'slide-up');

        }, self.add);

        dom.compiler.register('attribute', 'activate', function(elem, attrs) {

            elem.addClass('ux-activation');
        });

        dom.compiler.register('attribute', 'delay', function(elem, attrs) {

            self._addAttr(elem, attrs.delay, 'delay');
        });

        dom.compiler.register('attribute', 'easing', function(elem, attrs) {

            if( attrs.easing != "ease-in-out-cubic" )
                self._addAttr(elem, attrs.easing, 'easing');
        });

        dom.compiler.register('attribute', 'visibility', function(elem, attrs) {

            var visibility = attrs.visibility.replace('%', '');

            if( visibility == "top")
                visibility = 1;

            if( visibility == "half")
                visibility = 0.5;

            if( visibility == "bottom")
                visibility = 0;

            dom.compiler.attr(elem, 'visibility', attrs.visibility.indexOf('%')>=0 ? parseInt(visibility)/100 : visibility);
        });


        dom.compiler.register('attribute', 'animation', function(elem, attrs) {

            self._addAttr(elem, attrs.animation, 'animation');

            if( attrs.animation == 'stack' )
                elem.find('[delay],[data-delay]').not('[animation],[data-animation]').attr('data-animation', 'slide-up');
        });
    }

    self.__construct();
};


var ux = ux || {};
ux.activation = new UXActivation();