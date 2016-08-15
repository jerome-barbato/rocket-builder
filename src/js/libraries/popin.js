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

    var that = this;

    /* Contructor. */

    /**
     *
     */
    that.__construct =  function(){

        that._setupEvents();
    };


    /* Public */

    that.config = {
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


    that.add = function( id, content, context ){

        if( that.config.id ){

            if( that.config.id == id && that.config.context == context ){

                that.show(that.config.id);
                return;
            }
            else{

                that._remove();
            }
        }

        that.config.id = id;
        that.config.context = context;

        that._add(content);
    };



    that.show = function( id ){

        if( id == that.config.id )
            that._show();
    };



    that.close = function( id ){

        if( id == that.config.id )
            that._close();
    };



    /* Private. */

    /**
     *
     */
    that._setupEvents = function() {

        $(document).on('click', '[data-popin]', function(e) {

            e.preventDefault();

            var context = $(this).data('context') ? JSON.parse('{' + $(this).data('context').replace(/'/g, '"') + '}') : {};

            that.add($(this).data('popin'), false, context);
        });
    };



    that._remove = function(){

        that.config.$popin.remove();
        that.config.id = that.config.$popin = false;
        that.config.context = { remove : false };
    };


    that._close = function(){

        if( !that.config.$popin ) return;

        if( Modernizr && Modernizr.csstransitions ) {

            that.config.$body.removeClass('ui-popin--adding').addClass('ui-popin--removing');

            that.config.$popin.one(that.config.transitionEnd, function () {

                that.config.$body.removeClass('ui-popin--removing');

                $(document).trigger('ui-popin.removed', [that.config.id]);

                if( that.config.context.remove )
                    that._remove();
                else
                    that.config.$popin.hide();

                that.config.$body.repaint();
            });
        }
        else{

            if( that.config.context.remove )
                that._remove();
            else
                $popin.hide();
        }

        that.config.$body.removeClass('ui-popin--added');
    };



    that._add = function(content){

        if( typeof(content) == "undefined" || content === false )
            content = $('template#'+that.config.id).html();

        if ( !window.angular ){

            if( typeof(that.config.context) != "undefined" )
                content = content.populate(that.config.context);
        }

        var $popin   = $(that.config.html.popin);
        var $content = $popin.find('.ui-popin__content');

        $content.append(content);

        if( !$content.find('.ui-popin__close, .ui-popin-close').length )
            $content.append(that.config.html.close);

        that.config.$body.append($popin);
        $popin.addClass('ui-popin--'+that.config.id);

        that.config.$popin = $popin;

        if( $popin.find('.ui-slider').length && typeof(ui.sliders) != "undefined" )
            ui.sliders.init();

        that._show();
    };



    that._show = function() {

        that.config.$popin.show().repaint();

        that.config.$body.addClass('ui-popin--added');

        $(document).trigger('ui-popin.added', [that.config.$popin, that.config.id, that.config.context]);

        if( Modernizr && Modernizr.csstransitions ){

            that.config.$body.addClass('ui-popin--adding');

            that.config.$popin.one(that.config.transitionEnd, function() {

                that.config.$body.removeClass('ui-popin--adding');
            });
        }
        else{

            that.config.$body.removeClass('ui-popin--adding');
        }


        that.config.$popin.on('click', function(e) {

            if( $(e.target).hasClass('ui-popin__overlay') || $(e.target).hasClass('ui-popin__close') || $(e.target).hasClass('ui-popin-close')){

                that.config.$popin.off('click');
                that._close();
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


    that.__construct();
};

var ui = ui || {};
ui.popin = new UIPopin();