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

var UXFit = function() {

    var self = this;

    self.timeout   = false;
    self.warn      = false;

    self.selector  = 'ux-fit';


    /* Public methods. */
    self.compute = function( $element ) {

        if( $element.data('waiting') ) return;

        var $container       = $element.parent();
        var container_width  = $container.width();
        var container_height = $container.height();
        var container_ratio  = container_width/container_height;

        self._getRatio($element, function( element_ratio ){

            if( $element.data('fit') == "contain" ){

                if( element_ratio < container_ratio ) {

                    var width = Math.round(container_height*element_ratio);
                    $element.css({width:width, height:container_height, top:''});
                }
                else {

                    var height = Math.round(container_width/element_ratio);
                    $element.css({width:container_width, height:height, top:(container_height-height)/2+'px'});
                }

            }else{

                if( element_ratio > container_ratio ) {

                    var width = Math.round(container_height*element_ratio);
                    $element.css({width:width, height:container_height, left:(container_width-width)/2+'px', top:''});
                }
                else {

                    var height = Math.round(container_width/element_ratio);
                    $element.css({width:container_width, height:height, top:(container_height-height)/2+'px', left:''});
                }
            }
        });
    };




    /**
     *
     */
    self._add = function($element) {

        if( Modernizr && Modernizr.objectfit )
            return;

        $element.data('waiting', false);

        if( !$element.data('ratio') ) {

            self._getRatio($element, function() {

                self.compute($element);
            });
        }
        else
            self.compute($element);

        $(document).on('loaded', function(){ self.compute($element) });
        $(window).resize(function(){ self.compute($element) });
    };


    self._getRatio = function( $element, callback ){

        if( $element.data('ratio') ){

            callback($element.data('ratio'));
            return;
        }

        var width    = parseInt($element.attr('width'));
        var height   = parseInt($element.attr('height'));
        var ratio    = Math.round( (width/height)*100 )/100;

        if( isNaN(ratio) ){

            if( !self.warn ){

                console.warn("there was a prb computing an image ratio, please be sure to specify width/height in the html to avoid resize on image loading");
                self.warn = true;
            }

            var getNaturalDimensions = function(){

                var width    = parseInt($element.naturalWidth());
                var height   = parseInt($element.naturalHeight());
                var ratio    = Math.round( (width/height)*100 )/100;

                $element.data('waiting', false);

                if( !isNaN(ratio) ){

                    $element.data('ratio', ratio);

                    if( callback )
                        callback(ratio);
                }
            };

            if( $element.prop('complete') ){

                getNaturalDimensions();
            }
            else{

                $element.data('waiting', true);
                $element.load(getNaturalDimensions);
            }
        }
        else{

            $element.data('ratio', ratio);

            if( callback )
                callback(ratio);
        }
    };



    self.__construct = function(){

        $('[data-fit]').initialize(function() {

            var $element = $(this);

            self._add($element);
        });
    };



    if( typeof DOMCompiler !== "undefined" ) {

        dom.compiler.register('attribute', 'object-fit', function(elem, attrs) {

            elem.parent().addClass(self.selector);
            elem.attr('data-fit', attrs.objectFit.length ? attrs.objectFit : 'cover');

        }, self._add);
    }


    /*
     * jQuery extension
     *
     * ex: $('.class').fit();
     */

    if (window.jQuery) {

        window.jQuery.fn.fit = function(recompute_ratio) {

            if( typeof recompute_ratio == "undefined" )
                recompute_ratio = false;

            if( Modernizr && Modernizr.objectfit )
                return;

            $(this).each(function() {

                if( recompute_ratio )
                    $(this).data('ratio', false);

                ux.fit.compute( $(this) )
            });
        };
    }

    self.__construct();
};


var ux = ux || {};
ux.fit = new UXFit();
