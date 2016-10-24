/**
 * Popin
 *
 * Copyright (c) 2014 - Metabolism
 * Author:
 *   - Metabolism <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 1.4
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
 **/

var UXPopin = function(){

    var self = this;

    /* Contructor. */

    /**
     *
     */
    self.__construct =  function(){

        self._setupEvents();
    };


    /* Public */

    self.config = {
        $body   : $('body'),
        $popin  : false,
        id      : false,
        context : {
            remove : false
        },
        transitionEnd : 'webkitTransitionEnd.ux-popin transitionend.ux-popin msTransitionEnd.ux-popin oTransitionEnd.ux-popin',
        html : {

            popin:'<div class="ux-popin"><div class="valign"><div class="valign__middle ux-popin__overlay"><div class="ux-popin__content"></div></div></div></div>',
            close : '<a class="ux-popin__close"></a>'
        }
    };

    self.context = {};


    self.add = function( id, content, context ){

        if( self.config.id ){

            if( self.config.id == id && self.context == context ){

                self.show(self.config.id);
                return;
            }
            else{

                self._remove();
            }
        }

        self.config.id = id;
        self.context = $.extend(self.config.context, context);

        self._add(content);
    };



    self.show = function( id ){

        if( id == self.config.id )
            self._show();
    };



    self.getId = function(){

        return self.config.id;
    };



    self.close = function( id ){

        if( typeof id == 'undefined' || id == self.config.id )
            self._close();
    };



    /* Private. */

    /**
     *
     */
    self._setupEvents = function() {

        $(document).on('click', '[data-popin]', function(e) {

            e.preventDefault();
            var context = {};

            try {
                context = $(this).data('context') ? JSON.parse('{' + $(this).data('context').replace(/'/g, '"') + '}') : {};
            } catch(e) {}


            self.add($(this).data('popin'), false, context);
        });
    };



    self._remove = function(){

        self.config.$popin.remove();
        self.config.id = self.config.$popin = false;
        self.config.context = {};
    };


    self._close = function(){

        if( !self.config.$popin ) return;

        if( Modernizr && Modernizr.csstransitions ) {

            self.config.$body.removeClass('ux-popin--adding').addClass('ux-popin--removing');

            self.config.$popin.one(self.config.transitionEnd, function() {

                self.config.$body.removeClass('ux-popin--removing');

                $(document).trigger('ux-popin.removed', [self.config.id]);

                if( self.context.remove )
                    self._remove();
                else
                    self.config.$popin.hide();

                self.config.$body.repaint();
            });
        }
        else{

            if( self.context.remove )
                self._remove();
            else
                $popin.hide();
        }

        self.config.$body.removeClass('ux-popin--added');
    };



    self._add = function(content){

        if( typeof(content) == "undefined" || content === false )
            content = $('template#'+self.config.id).html();

        if ( !window.angular )
            content = content.populate(self.context);

        var $popin   = $(self.config.html.popin);
        var $content = $popin.find('.ux-popin__content');

        $content.append(content);

        if( !$content.find('.ux-popin__close, .ux-popin-close').length )
            $content.append(self.config.html.close);

        self.config.$body.append($popin);
        $popin.addClass('ux-popin--'+self.config.id);

        self.config.$popin = $popin;

        if( window.angular && angular.$injector ){

            angular.$injector.invoke(function($compile, $rootScope){

                var scope = $popin.scope() || $rootScope.$new();
                scope = angular.extend(scope, self.context);

                //todo: find why context is not interpoled
                $compile($popin.contents())(scope);
            });
        }

        self._show();
    };



    self._show = function() {

        self.config.$popin.show().repaint();

        self.config.$body.addClass('ux-popin--added');

        $(document).trigger('ux-popin.added', [self.config.$popin, self.config.id, self.context]);

        if( Modernizr && Modernizr.csstransitions ){

            self.config.$body.addClass('ux-popin--adding');

            self.config.$popin.one(self.config.transitionEnd, function() {

                self.config.$body.removeClass('ux-popin--adding');
            });
        }
        else{

            self.config.$body.removeClass('ux-popin--adding');
        }


        self.config.$popin.on('click keypress', function(e) {

            if (e.which === 13 || e.type === 'click') {

                if( $(e.target).hasClass('ux-popin__overlay') || $(e.target).hasClass('ux-popin__close') || $(e.target).hasClass('ux-popin-close')){

                    self.config.$popin.off('click');
                    self._close();
                }
            }
        });
    };



    if( typeof DOMCompiler !== "undefined" ) {

        dom.compiler.register('attribute', 'popin', function(elem, attrs) {

            elem.attr('data-popin', attrs.popin);

            if( attrs.context ){

                elem.attr('data-context', attrs.context);
                elem.removeAttr('context');
            }
        });
    }


    self.__construct();
};

var ux = ux || {};
ux.popin = new UXPopin();