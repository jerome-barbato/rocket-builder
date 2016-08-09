/**
 * Object fit polyfill
 *
 * Copyright (c) 2014 - Metabolism
 * Author:
 *   - Metabolism <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 1.1
 *
 * Requires:
 *   - jQuery
 *
 **/

var UIFit = function() {

    var that = this;

    that.$elements = false;
    that.timeout   = false;
    that.warn      = false;

    that.selector  = 'ui-fit';


    /* Public methods. */
    that.compute = function( $element ) {

        if( !$element.is(':visible') ) return;

        var $container       = $element.closest('.'+that.selector);
        var container_width  = $container.width();
        var container_height = $container.height();
        var container_ratio  = container_width/container_height;

        that._getRatio($element, function( element_ratio ){

            if( $element.hasClass(that.selector+"__contain") ){

                if( element_ratio < container_ratio ) {

                    var width = Math.round(container_height*element_ratio);
                    $element.css({width:width, height:container_height, left:(container_width-width)/2+'px', top:0});
                }
                else {

                    var height = Math.round(container_width/element_ratio);
                    $element.css({width:container_width, height:height, top:(container_height-height)/2+'px', left:0});
                }

            }else{

                if( element_ratio > container_ratio ) {

                    var width = Math.round(container_height*element_ratio);
                    $element.css({width:width, height:container_height, left:(container_width-width)/2+'px', top:0});
                }
                else {

                    var height = Math.round(container_width/element_ratio);
                    $element.css({width:container_width, height:height, top:(container_height-height)/2+'px', left:0});
                }
            }
        });
    };




    /**
     *
     */
    that._init = function() {

        that.$elements = $('.'+that.selector.object);

        that.$elements.each(function() {

            var $element = $(this);

            if( !$element.data('ratio') )
                that._getRatio($element);
        });
    };



    that._getRatio = function( $element, callback ){

        if( $element.data('ratio') ){

            callback($element.data('ratio'));
            return;
        }

        var width    = parseInt($element.attr('width'));
        var height   = parseInt($element.attr('height'));
        var ratio    = Math.round( (width/height)*100 )/100;

        if( isNaN(ratio) ){

            if( !that.warn ){

                console.warn("there was a prb computing an image ratio, please be sure to specify width/height in the html to avoid resize on image loading");
                that.warn = true;
            }

            var getNaturalDimensions = function(){

                var width    = parseInt($element.naturalWidth());
                var height   = parseInt($element.naturalHeight());
                var ratio    = Math.round( (width/height)*100 )/100;

                if( !isNaN(ratio) ){

                    $element.data('ratio', ratio);

                    if( callback )
                        callback(ratio);
                }
            };

            if( $element.prop('complete') )
                getNaturalDimensions();
            else
                $element.load(getNaturalDimensions);
        }
        else{

            $element.data('ratio', ratio);

            if( callback )
                callback(ratio);
        }
    };



    that._computeAll = function(){

        setTimeout(function(){

            $('.'+that.selector.object).each(function() {

                that.compute($(this));
            });
        });
    };



    that.__construct = function(){

        if( Modernizr && Modernizr.objectfit )
            return;

        $(document).on('boot', that._init);
        $(document).on('loaded', that._computeAll);

        $(window).resize(that._computeAll);
    };



    if( typeof DOMCompiler !== "undefined" ) {

        dom.compiler.register('attribute', 'object-fit', function (elem, attrs) {

            elem.parent().addClass(that.selector);
            elem.addClass(that.selector + '__' + (attrs.objectFit.length ? attrs.objectFit : 'cover'));
        });
    }


    /*
     * jQuery extension
     *
     * ex: $('.class').fit();
     */

    if (window.jQuery) {

        window.jQuery.fn.fit = function() {

            if( Modernizr && Modernizr.objectfit )
                return;

            $(this).each(function() { ui.fit.compute( $(this) ) });
        };
    }

    that.__construct();
};


var ui = ui || {};
ui.fit = new UIFit();


