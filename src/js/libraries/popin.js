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

var UIPopin = function(config){

    var that = this;

    that.popins = [];

    /* Contructor. */

    /**
     *
     */
    that.__construct =  function(config){

        that.config = $.extend(that.config, config);
        that._setupEvents();
    };


    /* Public */

    that.config = {

        transitionEnd : 'webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd',
        html : {

            popin:'<div class="ui-popin"><div class="valign"><div class="valign__middle ui-popin__overlay"><div class="ui-popin__content"></div></div></div></div>',
            close : '<a class="ui-popin__close"></a>'
        }
    };


    that.add = function( id, content, context, remove ){

        if( $('.ui-popin--'+id).length ){

            that.show(id);
            return;
        }

        if( typeof(content) == "undefined" || content === false )
            content = $('template#'+id).html();

        if ( !window.angular ){

            if( typeof(context) != "undefined" ){

                $.each(context, function(key, value){

                    content = content.split('[['+key+']]').join(value);
                });
            }
            else{

                content = content.replace(/\[\[/g, "'").replace(/\]\]/g, "'");
            }

            if( typeof DOMCompiler !== "undefined" ){

                var $content = $('<div/>').append(content);
                dom.compiler.run($content);
                content = $content.html();
            }
        }

        return that._add(content, id, remove);
    };



    that.show = function( id ){

        var $popin = $('.ui-popin--'+id);

        if( $popin.length )
            that._show( $popin );
    };



    that.close = function( popin ){

        var $popin = $('.ui-popin--'+popin);
        that._remove( $popin );
    };



    /* Private. */

    /**
     *
     */
    that._setupEvents = function() {

        $(document).on('click', '.ui-popin-trigger', function(e) {

            e.preventDefault();

            var id      = $(this).data('popin');
            var context = $(this).data('context') ? JSON.parse('{' + $(this).data('context').replace(/'/g, '"') + '}') : {};
            var remove  = $(this).hasDataAttr('remove') ? $(this).data('remove') : true;

            if( $('.ui-popin--'+id).length )
                ui.popin.show(id);
            else
                ui.popin.add(id, $('template#'+id).html(), context, remove);
        });
    };



    that._remove = function( $popin ){

        $(window).enableScroll();

        if( !$popin || !$popin.length ) return;

        var $body = $('body');

        if( Modernizr && Modernizr.csstransitions ) {

            $body.addClass('ui-popin--removing');

            $popin.one(that.config.transitionEnd, function () {

                $body.removeClass('ui-popin--removing');

                $(document).trigger('ui-popin.removed', [$popin]);

                if( $popin.data('remove') )
                    $popin.remove();
                else
                    $popin.hide();

                $body.repaint();
            });
        }
        else{

            if( $popin.data('remove') )
                $popin.remove();
            else
                $popin.hide();
        }

        $body.removeClass('ui-popin--added');
    };



    that._add = function(content, id, remove){

        var $popin   = $(that.config.html.popin);
        var $body    = $('body');
        var $content = $popin.find('.ui-popin__content');
        
        $content.append(content);

        if( !$content.find('.ui-popin__close').length )
            $content.append(that.config.html.close);

        $body.append($popin);
        $popin.addClass('ui-popin--'+id);

        $popin.data('remove', typeof remove != "undefined" ? remove : true);

        if( $popin.find('.ui-slider').length && typeof(ui.sliders) != "undefined" )
            ui.sliders.init();

        that._show($popin);
    };



    that._show = function( $popin ) {

        $(window).disableScroll();

        var $body = $('body');

        $popin.show().repaint();

        $body.addClass('ui-popin--added');

        $(document).trigger('ui-popin.added', [$popin]);

        if( Modernizr && Modernizr.csstransitions ){

            $body.addClass('ui-popin--adding');

            $popin.one(that.config.transitionEnd, function() {

                $body.removeClass('ui-popin--adding');
            });
        }
        else{

            $body.removeClass('ui-popin--adding');
        }


        $popin.on('click', function(e) {

            if( $(e.target).hasClass('ui-popin__overlay') || $(e.target).hasClass('ui-popin__close')){

                $popin.off('click');
                that._remove($popin);
            }
        });

        return $popin;
    };



    if( typeof DOMCompiler !== "undefined" ) {

        dom.compiler.register('attribute', 'popin', function (elem, attrs) {

            elem.addClass('ui-popin-trigger');
            elem.attr('data-popin', attrs.popin);

            if( attrs.context ){

                elem.attr('data-context', attrs.context);
                elem.removeAttr('context');
            }

            if( attrs.removeOnClose ){

                elem.attr('data-remove', attrs.remove);
                elem.removeAttr('remove-on-close');
            }
        });
    }


    that.__construct(config);
};

var ui = ui || {};
ui.popin = new UIPopin();