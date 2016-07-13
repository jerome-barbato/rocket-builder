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
    that.selector  = {
        parent:'ui-fit',
        object:'ui-fit__object'
    };


    /* Public methods. */
    that.compute = function( $element ) {

        if( !$element.is(':visible') ) return;

        var $container       = $element.closest('.'+that.selector.parent);
        var container_width  = $container.width();
        var container_height = $container.height();
        var container_ratio  = container_width/container_height;
        var element_ratio    = $element.data('ratio');

        if( !$element.data('ratio') )
            element_ratio = that._getRatio($element);

        if( $element.hasClass(that.selector.object+"--contain") ){

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



    that._getRatio = function( $element ){

        var width    = parseInt($element.attr('width'));
        var height   = parseInt($element.attr('height'));
        var ratio    = Math.round( (width/height)*100 )/100;

        if( isNaN(ratio) )
            console.error("there is a prb computing the image ratio, please be sure to specify width/height in the html");

        $element.data('ratio', ratio);

        return ratio;
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

            elem.parent().addClass(that.selector.parent);
            elem.addClass(that.selector.object + ' ' + that.selector.object + '--' + (attrs.objectFit.length ? attrs.objectFit : 'cover'));
        });
    }


    that.__construct();
};


var ui = ui || {};
ui.fit = new UIFit();



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