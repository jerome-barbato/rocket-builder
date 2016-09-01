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
 *   Added angular popin directive via ui-popin module
 *
 *   #1.4
 *   Added popin-template directive when the popin is allready in the dom ( ex: nested ui-view )
 *   Empty ui-view on close if not removed
 *
 **/

var UIPopin = function(){

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
        transitionEnd : 'webkitTransitionEnd.ui-popin transitionend.ui-popin msTransitionEnd.ui-popin oTransitionEnd.ui-popin',
        html : {

            popin:'<div class="ui-popin"><div class="valign"><div class="valign__middle ui-popin__overlay"><div class="ui-popin__content"></div></div></div></div>',
            close : '<a class="ui-popin__close"></a>'
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

            self.config.$body.removeClass('ui-popin--adding').addClass('ui-popin--removing');

            self.config.$popin.one(self.config.transitionEnd, function () {

                self.config.$body.removeClass('ui-popin--removing');

                $(document).trigger('ui-popin.removed', [self.config.id]);

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

        self.config.$body.removeClass('ui-popin--added');
    };



    self._add = function(content){

        if( typeof(content) == "undefined" || content === false )
            content = $('template#'+self.config.id).html();

        if ( !window.angular )
            content = content.populate(self.context);

        var $popin   = $(self.config.html.popin);
        var $content = $popin.find('.ui-popin__content');

        $content.append(content);

        if( !$content.find('.ui-popin__close, .ui-popin-close').length )
            $content.append(self.config.html.close);

        self.config.$body.append($popin);
        $popin.addClass('ui-popin--'+self.config.id);

        self.config.$popin = $popin;

        if( $popin.find('.ui-slider').length && typeof(ui.sliders) != "undefined" )
            ui.sliders.init();

        self._show();
    };



    self._show = function() {

        self.config.$popin.show().repaint();

        self.config.$body.addClass('ui-popin--added');

        $(document).trigger('ui-popin.added', [self.config.$popin, self.config.id, self.context]);

        if( Modernizr && Modernizr.csstransitions ){

            self.config.$body.addClass('ui-popin--adding');

            self.config.$popin.one(self.config.transitionEnd, function() {

                self.config.$body.removeClass('ui-popin--adding');
            });
        }
        else{

            self.config.$body.removeClass('ui-popin--adding');
        }


        self.config.$popin.on('click', function(e) {

            if( $(e.target).hasClass('ui-popin__overlay') || $(e.target).hasClass('ui-popin__close') || $(e.target).hasClass('ui-popin-close')){

                self.config.$popin.off('click');
                self._close();
            }
        });
    };



    if( typeof DOMCompiler !== "undefined" ) {

        dom.compiler.register('attribute', 'popin', function (elem, attrs) {

            elem.attr('data-popin', attrs.popin);

            if( attrs.context ){

                elem.attr('data-context', attrs.context);
                elem.removeAttr('context');
            }
        });
    }


    self.__construct();
};

var ui = ui || {};
ui.popin = new UIPopin();