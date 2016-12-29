/**
 * Popin
 *
 * Copyright (c) 2014 - Metabolism
 * Author:
 *   - Metabolism <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 2.0
 *
 * Requires:
 *   - jQuery
 *
 * Changelog:
 *   # 1.3
 *   Added angular popin directive via ux-popin module
 *
 *   #1.4
 *   Added popin-template directive when the popin is allready in the dom ( ex: nested ux-view )
 *   Empty ux-view on close if not removed
 *
 *   #2.0
 *   Each popin is now a new instance
 *
 **/

var UXPopin = function(id, content, context){

    var self   = this;
    var $body  = $('body');
    var $popin = false;
    var transitionEnd = 'webkitTransitionEnd.ux-popin transitionend.ux-popin msTransitionEnd.ux-popin oTransitionEnd.ux-popin';

    /* Public */

    var config = {
        html   : {

            popin : '<div class="ux-popin">'+
            '<div class="valign"><div class="valign__middle ux-popin__overlay">'+
            '<div class="ux-popin__content"></div>'+
            '</div></div>'+
            '</div>',
            close : '<a class="ux-popin__close"></a>'
        }
    };


    self.context = {
        remove : true
    };


    self.show = function(){

        show();
    };

    self.close = function(){

        close();
    };

    /* Contructor. */

    /**
     *
     */
    var construct =  function(){

        self.context = $.extend(self.context, context);

        if( typeof(content) == "undefined" || content === false )
            content = $('template#'+id).html();

        add(content);
        setupEvents();
    };


    /* Private. */

    /**
     *
     */
    var setupEvents = function() {

        $popin.on('click keypress', function(e) {

            if (e.which === 13 || e.type === 'click') {

                if( $(e.target).hasClass('ux-popin__overlay') || $(e.target).hasClass('ux-popin__close') || $(e.target).hasClass('ux-popin-close')){

                    $popin.off('click keypress');
                    close();
                }
            }
        });

        $popin.on('ux-popin.close', function(e) {

            close();
        });
    };



    var remove = function(){

        if( $popin.length )
            $popin.remove();

        $popin = self.context = self = null;
    };


    var close = function(){

        if( Modernizr && Modernizr.csstransitions ) {

            $popin.removeClass('ux-popin--adding').addClass('ux-popin--removing');

            $popin.one(transitionEnd, function() {

                $popin.removeClass('ux-popin--removing');

                $(document).trigger('ux-popin.removed', [id]);

                if( self.context.remove )
                    remove();
                else
                    $popin.hide();

                $body.repaint();
            });
        }
        else{

            if( self.context.remove )
                remove();
            else
                $popin.hide();
        }

        $popin.removeClass('ux-popin--added');
    };



    var add = function(content){

        if ( !window.angular )
            content = content.populate(self.context);

        $popin = $(config.html.popin);
        var $content = $popin.find('.ux-popin__content');

        $content.append(content);

        if( !$content.find('.ux-popin__close, .ux-popin-close').length )
            $content.append(config.html.close);

        $body.append($popin);
        $popin.addClass('ux-popin--'+id);

        if( 'angular' in window && angular.$injector ){

            angular.$injector.invoke(function($compile, $rootScope){

                var scope = $popin.scope() || $rootScope.$new();
                scope = angular.extend(scope, self.context);

                //todo: find why context is not interpoled
                $compile($popin.contents())(scope);
            });
        }

        show();
    };



    var show = function() {

        $popin.show().repaint();

        $popin.addClass('ux-popin--added');

        $(document).trigger('ux-popin.added', [$popin, id, self.context]);

        if( Modernizr && Modernizr.csstransitions ){

            $popin.addClass('ux-popin--adding');

            $popin.one(transitionEnd, function() {

                $popin.removeClass('ux-popin--adding');
            });
        }
        else{

            $popin.removeClass('ux-popin--adding');
        }
    };

    construct();

    return self;
};



var UXPopins = function(){

    var self = this;

    // Start backward compatibility

    self.popins = {};

    self.add = function(id, content, context ){

        if(id in self.popins )
            self.popins[id].close();

        self.popins[id] = new UXPopin(id, content, context);
    };


    self.show = function( id ){

        if(id in self.popins )
            self.popins[id].show();
    };


    self.close = function( id ){

        if(id in self.popins )
            self.popins[id].close();
    };

    // End backward compatibility

    $(document).on('click', '[data-popin]', function(e) {

        e.preventDefault();
        var context = {};

        if( $(this).data('context') ){

            try {
                context = $(this).data('context') ? JSON.parse('{' + $(this).data('context').replace(/'/g, '"') + '}') : {};
            } catch(e) {}
        }
        else{

            context = $(this).data();
        }

        self.add($(this).data('popin'), false, context);
    });


    if( typeof DOMCompiler !== "undefined" ) {

        dom.compiler.register('attribute', 'popin', function(elem, attrs) {

            elem.attr('data-popin', attrs.popin);

            if( attrs.context ){

                elem.attr('data-context', attrs.context);
                elem.removeAttr('context');
            }
        });
    }
};

var ux = ux || {};
ux.popin = new UXPopins();