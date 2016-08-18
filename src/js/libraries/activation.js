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

    var that = this;


    /* Public */

    that.context = {
        hold          : false,
        window_height : 0,
        elements      : [],
        lang          : $('html').attr('lang'),
        animationEnd  : 'animationend.ui-animation oanimationend.ui-animation webkitAnimationEnd.ui-animation MSAnimationEnd.ui-animation'
    };


    that.config = {
        offset  : 0.2,
        reverse : false,
        debug   : false,
        tablet  : false,
        phone   : false
    };


    that.add = function( $element ){


        if( !$element || !$element.length )
            return;

        that._add( $element );
        that._init();
    };


    that.reset = function( $dom ){

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

            $.each(that.context.elements, function(index, element) {

                if (element.active && $item.is(element.$))
                    element.active = false;
            });
        });
    };


    /* Private. */

    that._init = function(){

        if( Modernizr && Modernizr.csstransitions )
            that._scroll();
    };



    that.onAnimationEnded = function($element, callback){

        var keep   = $element.hasDataAttr('keep') ? $element.data('keep') : false;
        var $items = $element.find('.ui-animation');

        if( $items.length && $element.hasClass('ui-animation--stack') ){

            var i = 0;

            $items.one(that.context.animationEnd, function(){

                i++;

                if( i == $items.length ){

                    if( !that.config.reverse ) {

                        $element.removeClass('ui-activation--active');

                        $element.trigger('ui-animation.end');

                        if ($element.hasClass('ui-activation')) {

                            setTimeout(function () {
                                $element.addClass('ui-activation--seen');
                                $items.addClass('ui-activation--seen');
                            });
                        }

                        if (!that.config.debug && !keep) {

                            $element.removeClass('ui-animation').alterClass('ui-animation--*');
                            $items.removeClass('ui-animation').alterClass('ui-animation--*');
                        }
                    }

                    $items.unbind(that.context.animationEnd);
                    $element.unbind(that.context.animationEnd);

                    if( callback )
                        callback();
                }
            });
        }
        else{

            $element.one(that.context.animationEnd, function(){

                if( !that.config.reverse ) {

                    $element.removeClass('ui-activation--active');

                    if( $element.hasClass('ui-activation') )
                        setTimeout(function(){ $element.addClass('ui-activation--seen') });

                    if( !that.config.debug && !keep) {

                        $element.removeClass('ui-animation').alterClass('ui-animation--*');
                        $element.trigger('ui-animation.end');
                    }
                }

                $element.unbind(that.context.animationEnd);

                if( callback )
                    callback();
            });
        }
    };



    that._add = function($element){

        if( that.context.disable ){

            $element.alterClass('ui-animation--*').removeClass('ui-animation');
            $element.find('.ui-animation').alterClass('ui-animation--*').removeClass('ui-animation');
            $element.addClass('ui-activation--active ui-activation--seen');
        }
        else{

            var offset   = $element.hasDataAttr('offset') ? parseFloat($element.data('offset')) : that.config.offset;
            var element  = {$:$element, top:$element.offset().top, offset:offset, active:false, increment:$element.hasClass('ui-animation--name-increment')};
            var value    = parseFloat( that.context.lang=='fr' ? $element.text().replace(/,/, '.') : $element.text().replace(/,/g, '') );

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

            that.context.elements.push(element);
        }
    };



    that._setupEvents = function() {

        $(window)
            .scroll( that._scroll )
            .resize(function(){ that._recompute(); that._scroll() });
    };



    that._recompute = function(){

        that.context.window_height = $(window).height();

        $.each(that.context.elements, function(i, element){

            element.top = element.$.offset().top;
        });
    };



    that._decrement = function(element){
        //todo
    };



    that._increment = function(element){

        var unit_decimal  = that.context.lang=='fr'?',':'.';
        var unit_thousand = that.context.lang=='fr'?' ':',';

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



    that._scroll = function() {

        if( that.context.hold ) return;

        var scrollTop = $(window).scrollTop()+that.context.window_height;

        $.each(that.context.elements, function(index, element) {

            if( element.active ) {

                if( that.config.reverse && element.top > scrollTop+that.context.window_height ){

                    element.$.removeClass('ui-activation--active');
                    element.active = false;

                    if( element.increment )
                        that._decrement(element);
                }
            }
            else{

                if( scrollTop > element.top + that.context.window_height*element.offset  ){

                    that.onAnimationEnded(element.$);

                    element.$.addClass('ui-activation--active');

                    element.active = true;

                    if( element.increment )
                        that._increment(element);
                }
            }
        });
    };



    that._addClassFromAttr = function(elem, attrs, id, name){

        if( attrs[id].length ){

            if( typeof name == "undefined" )
                name = id;

            if( attrs[id].indexOf(':') > -1 && attrs[id].indexOf('{') == -1 ) {

                var values = JSON.parse('{"' + attrs[id].replace(/ /g, '","').replace(/:/g, '":"') + '"}');

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
    that.__construct =  function() {

        that.context.disable = (browser.phone && !that.config.phone) || (browser.tablet && !that.config.tablet);

        $('.ui-activation').initialize(function() {

            that.add( $(this) );
        });

        $(document).on('loaded', function(){

            that._setupEvents();
            that._recompute();
            that._scroll();
        });
    };



    if( typeof DOMCompiler !== "undefined" ){

        dom.compiler.register('attribute', 'when-visible', function(elem, attrs) {

            elem.addClass('ui-activation ui-animation ui-animation--'+attrs.whenVisible);
            dom.compiler.attr(elem, 'animation', attrs.whenVisible);

        }, that.add);

        dom.compiler.register('attribute', 'activate', function(elem, attrs) {

            elem.addClass('ui-activation');
        });

        dom.compiler.register('attribute', 'delay', function(elem, attrs) {

            elem.addClass('ui-animation');

            dom.compiler.attr(elem, 'delay', attrs.delay);
            that._addClassFromAttr(elem, attrs, 'delay');
        });

        dom.compiler.register('attribute', 'easing', function(elem, attrs) {

            elem.addClass('ui-animation');
            that._addClassFromAttr(elem, attrs, 'easing');
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

            that.onAnimationEnded($element, function(){

                $element.alterClass('ui-animation--*');

                if( animation && animation.length && $element.hasDataAttr('animation') )
                    $element.addClass('ui-animation--'+$element.data('animation'));

                if( callback )
                    callback.call($element);
            });

            $element.addClass('ui-animation--active').show();
        };
    }


    that.__construct();
};


var ui = ui || {};
ui.activation = new UIActivation();