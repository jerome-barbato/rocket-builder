/**
 * Activation
 *
 * Copyright (c) 2016 - Metabolism
 * Author:
 *   - Jérome Barbato <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 3
 *
 * Requires:
 *   - jQuery
 *
 **/

var UIActivation = function(){

    var self = this;


    /* Public */

    self.context = {
        hold          : false,
        window_height : 0,
        elements      : [],
        lang          : $('html').attr('lang'),
        animationEnd  : 'animationend.ui-animation oanimationend.ui-animation webkitAnimationEnd.ui-animation MSAnimationEnd.ui-animation'
    };


    self.config = {
        offset  : 0.2,
        reverse : false,
        debug   : false,
        tablet  : false,
        phone   : false
    };


    self.add = function( $element ){


        if( !$element || !$element.length )
            return;

        self._add( $element );
        self._init();
    };


    self.reset = function( $dom ){

        if( !$dom || !$dom.length )
            return;

        $dom.find('.ui-activation').each(function(){

            var $item = $(this);
            $item.removeClass('ui-activation--seen');

            if( $item.data('animation') ){

                $item.addClass('ui-animation ui-animation--'+$item.data('animation'));
                if( $item.data('animation') == "stack" ){

                    $dom.find('.ui-activation--seen').each(function(){

                        $(this).removeClass('ui-activation--seen').addClass('ui-animation ui-animation--delay-'+$(this).data('delay'));

                        if( $(this).data('animation') )
                            $(this).addClass('ui-animation--'+$(this).data('animation'));
                    })
                }
            }

            $.each(self.context.elements, function(index, element) {

                if (element.active && $item.is(element.$))
                    element.active = false;
            });
        });
    };


    /* Private. */

    self._init = function(){

        if( Modernizr && Modernizr.csstransitions )
            self._scroll();
    };



    self.onAnimationEnded = function($element, callback){

        var keep   = $element.hasDataAttr('keep') ? $element.data('keep') : false;
        var $items = $element.find('.ui-animation');

        if( $items.length && $element.hasClass('ui-animation--stack') ){

            var i = 0;

            $items.one(self.context.animationEnd, function(){

                i++;

                if( i == $items.length ){

                    if( !self.config.reverse ) {

                        $element.removeClass('ui-activation--active');

                        $element.trigger('ui-animation.end');

                        if ($element.hasClass('ui-activation')) {

                            setTimeout(function () {
                                $element.addClass('ui-activation--seen');
                                $items.addClass('ui-activation--seen');
                            });
                        }

                        if (!self.config.debug && !keep) {

                            $element.removeClass('ui-animation').alterClass('ui-animation--*');
                            $items.removeClass('ui-animation').alterClass('ui-animation--*');
                        }
                    }

                    $items.unbind(self.context.animationEnd);
                    $element.unbind(self.context.animationEnd);

                    if( callback )
                        callback();
                }
            });
        }
        else{

            $element.one(self.context.animationEnd, function(){

                if( !self.config.reverse ) {

                    $element.removeClass('ui-activation--active');

                    if( $element.hasClass('ui-activation') )
                        setTimeout(function(){ $element.addClass('ui-activation--seen') });

                    if( !self.config.debug && !keep) {

                        $element.removeClass('ui-animation').alterClass('ui-animation--*');
                        $element.trigger('ui-animation.end');
                    }
                }

                $element.unbind(self.context.animationEnd);

                if( callback )
                    callback();
            });
        }
    };



    self._add = function($element){

        if( self.context.disable ){

            $element.alterClass('ui-animation--*').removeClass('ui-animation');
            $element.find('.ui-animation').alterClass('ui-animation--*').removeClass('ui-animation');
            $element.addClass('ui-activation--active ui-activation--seen');
        }
        else{

            var offset   = $element.hasDataAttr('offset') ? parseFloat($element.data('offset')) : self.config.offset;
            var element  = {$:$element, top:$element.offset().top, offset:offset, active:false, increment:$element.hasClass('ui-animation--name-increment')};
            var value    = parseFloat( self.context.lang=='fr' ? $element.text().replace(/,/, '.') : $element.text().replace(/,/g, '') );

            if( element.increment && !isNaN(value) ){

                var is_int = parseInt( value ) === value;
                var init   =  is_int ? Math.round(value*0.5) : Math.round(value*5)/10;

                if( init < 50 )
                    init = 0;

                if( !$element.hasDataAttr('offset') )
                    element.offset = 0;

                $element.text(init);

                element.value  = value;
                element.is_int = is_int;
                element.init   = init;
            }

            self.context.elements.push(element);
        }
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
        //todo
    };



    self._increment = function(element){

        var unit_decimal  = self.context.lang=='fr'?',':'.';
        var unit_thousand = self.context.lang=='fr'?' ':',';

        $({increment: element.init}).stop(true).animate({increment: element.value}, {
            duration : 1500,
            easing   : "easeOutCubic",
            step     : function () {

                var value = element.is_int ?
                    Math.round(this.increment).format(0).replace(/ /g, unit_thousand) :
                    (Math.round(this.increment*10)/10).format(1).replace('.', unit_decimal);

                element.$.text(value);
            }
        }, function () {

            element.$.text( element.is_int ? element.value.format(0).replace(/ /g, unit_thousand) : element.value.format(1).replace('.', unit_decimal) );
        });
    };



    self._scroll = function() {

        if( self.context.hold ) return;

        var scrollTop = $(window).scrollTop()+self.context.window_height;

        $.each(self.context.elements, function(index, element) {

            if( element.active ) {

                if( self.config.reverse && element.top > scrollTop+self.context.window_height ){

                    element.$.removeClass('ui-activation--active');
                    element.active = false;

                    if( element.increment )
                        self._decrement(element);
                }
            }
            else{

                if( scrollTop > element.top + self.context.window_height*element.offset  ){

                    self.onAnimationEnded(element.$);

                    element.$.addClass('ui-activation--active');

                    element.active = true;

                    if( element.increment )
                        self._increment(element);
                }
            }
        });
    };



    self._addClassFromAttr = function(elem, attrs, id, name){

        if( attrs[id].length ){

            if( typeof name == "undefined" )
                name = id;

            if( attrs[id].indexOf(':') > -1 && attrs[id].indexOf('{') == -1 ) {

                var values = {d:false, m:false, t:false};

                try {

                    values = JSON.parse('{"' + attrs[id].replace(/ /g, '","').replace(/:/g, '":"') + '"}');

                } catch (e) {}

                if (values.d)
                    elem.addClass('ui-animation--'+name+'-'+values.d);

                if (values.m)
                    elem.addClass('ui-animation--mobile--'+name+'-'+values.m);

                if (values.t)
                    elem.addClass('ui-animation--tablet--'+name+'-'+values.t);
            }
            else{

                elem.addClass('ui-animation--'+name+'-'+attrs[id]);
            }
        }
    };


    /* Constructor. */

    /**
     *
     */
    self.__construct =  function() {

        self.context.disable = (browser.phone && !self.config.phone) || (browser.tablet && !self.config.tablet);

        $('.ui-activation').initialize(function() {

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

            elem.addClass('ui-activation ui-animation ui-animation--'+attrs.whenVisible);
            dom.compiler.attr(elem, 'animation', attrs.whenVisible);

        }, self.add);

        dom.compiler.register('attribute', 'activate', function(elem, attrs) {

            elem.addClass('ui-activation');
        });

        dom.compiler.register('attribute', 'delay', function(elem, attrs) {

            elem.addClass('ui-animation');

            dom.compiler.attr(elem, 'delay', attrs.delay);
            self._addClassFromAttr(elem, attrs, 'delay');
        });

        dom.compiler.register('attribute', 'easing', function(elem, attrs) {

            elem.addClass('ui-animation');
            self._addClassFromAttr(elem, attrs, 'easing');
        });

        dom.compiler.register('attribute', 'visibility', function(elem, attrs) {

            dom.compiler.attr(elem, 'offset', parseInt(attrs.visibility.replace('%', ''))/100);
        });

        dom.compiler.register('attribute', 'animation', function(elem, attrs) {

            elem.addClass('ui-animation ui-animation--'+attrs.animation);

            dom.compiler.attr(elem, 'animation', attrs.animation);
        });

        dom.compiler.register('attribute', 'keep', function(elem, attrs) {

            dom.compiler.attr(elem, 'keep', attrs.keep);
        });
    }

    if (window.jQuery) {

        window.jQuery.fn.animation = function(animation, callback){

            if( typeof animation == 'function' ){

                callback  = animation;
                animation = false;
            }

            var $element = $(this);
            $element.removeClass('ui-activation--seen').addClass('ui-animation '+( animation && animation.length ? ' ui-animation--'+animation:''));

            self.onAnimationEnded($element, function(){

                $element.alterClass('ui-animation--*');

                if( animation && animation.length && $element.hasDataAttr('animation') )
                    $element.addClass('ui-animation--'+$element.data('animation'));

                if( callback )
                    callback.call($element);
            });

            $element.addClass('ui-animation--active').show();
        };
    }


    self.__construct();
};


var ui = ui || {};
ui.activation = new UIActivation();