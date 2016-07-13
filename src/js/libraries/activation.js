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
        $window       : false,
        window_height : 0,
        elements      : [],
        lang          : $('html').attr('lang'),
        animationEnd  : 'animationend.ui-animation oanimationend.ui-animation webkitAnimationEnd.ui-animation MSAnimationEnd.ui-animation'
    };


    that.config = {
        offset  : 0.2,
        reverse : false,
        debug   : false,
        mobile  : false
    };

    that.add = function( $elements ){

        if( !$elements || !$elements.length )
            return;
        
        $elements.each( function() {

            that._add( $(this) );
        });

        that._init();
    };
    

    /* Private. */

    that._init = function(){

        if( Modernizr && Modernizr.csstransitions )
            that._scroll();
        else
            $('.ui-activation').addClass('ui-activation--seen');
    };



    that.onAnimationEnded = function($element, callback){

        var keep   = $element.hasDataAttr('keep') ? $element.data('keep') : false;
        var $items = $element.find('.ui-animation');

        $items.unbind(that.context.animationEnd);
        $element.unbind(that.context.animationEnd);

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

                if( callback )
                    callback();
            });
        }
    };



    that._add = function($element){

        if( $element.data('ui-activation--initialized') !== true ){

            $element.data('ui-activation--initialized', true);

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

        that.context.$window = $(window);

        that.context.$window.scroll( that._scroll );
        that.context.$window.resize(that._recompute);

        setInterval(that._recompute, 1500);
    };



    that._recompute = function(){

        that.context.window_height = $(window).height();

        $.each(that.context.elements, function(i, element){

            element.top = element.$.offset().top;
        });
    };



    that._decrement = function(element){
        //todo
    }

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

        if( that.context.hold || !that.context.$window ) return;

        var scrollTop = that.context.$window.scrollTop()+that.context.window_height;

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

                if( element.top + that.context.window_height*element.offset < scrollTop ){

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


    /* Contructor. */

    /**
     *
     */
    that.__construct =  function() {

        $(document).on('boot', function(){

            if( !that.config.mobile && browser.mobile ){

                $('.ui-animation').alterClass('ui-animation--*').removeClass('ui-animation');
                $('.ui-activation').addClass('ui-activation--active ui-activation--seen');
            }
            else
                that.add( $('.ui-activation') );
        });

        $(document).on('loaded', function(){

            that._recompute();
            that._setupEvents();
            that._scroll();
        });
    };



    if( typeof DOMCompiler !== "undefined" ){

        dom.compiler.register('attribute', 'when-visible', function(elem, attrs) {

            elem.addClass('ui-activation ui-animation ui-animation--'+attrs.whenVisible);

            if( window.precompile )
                elem.attr('data-animation', attrs.whenVisible);
            else
                elem.data('animation', attrs.whenVisible);
        });

        dom.compiler.register('attribute', 'activate', function(elem, attrs) {

            elem.addClass('ui-activation');
        });

        dom.compiler.register('attribute', 'delay', function(elem, attrs) {

            elem.addClass('ui-animation');
            that._addClassFromAttr(elem, attrs, 'delay');
        });

        dom.compiler.register('attribute', 'offset', function(elem, attrs) {

            if( window.precompile )
                elem.attr('data-offset', attrs.offset);
            else
                elem.data('offset', attrs.offset);
        });

        dom.compiler.register('attribute', 'easing', function(elem, attrs) {

            elem.addClass('ui-animation');
            that._addClassFromAttr(elem, attrs, 'easing');
        });

        dom.compiler.register('attribute', 'visibility', function(elem, attrs) {

            if( window.precompile )
                elem.attr('data-visibility', parseInt(attrs.visibility.replace('%', ''))/100);
            else
                elem.data('visibility', parseInt(attrs.visibility.replace('%', ''))/100);
        });

        dom.compiler.register('attribute', 'animation', function(elem, attrs) {

            elem.addClass('ui-animation ui-animation--'+attrs.animation);

            if( window.precompile )
                elem.attr('data-animation', attrs.animation);
            else
                elem.data('animation', attrs.animation);
        });

        dom.compiler.register('attribute', 'keep', function(elem, attrs) {

            if( window.precompile )
                elem.attr('data-keep', attrs.keep);
            else
                elem.data('keep', attrs.keep);
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

                if( animation && animation.length )
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