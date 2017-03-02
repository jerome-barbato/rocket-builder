/**
 * Popin
 *
 * Copyright (c) 2017 - Metabolism
 * Author:
 *   - Metabolism <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 2.1.0
 *
 * Requires:
 *   - jQuery
 *
 * Changelog:
 *   # 1.3
 *   Added angular popin directive via popin module
 *
 *   #1.4
 *   Added popin-template directive when the popin is allready in the dom ( ex: nested meta-view )
 *   Empty meta-view on close if not removed
 *
 *   #2.0
 *   Each popin is now a new instance
 *
 **/

var MetaPopin = function(id, content, context)
{
    var self   = this;
    var $html  = $('html');
    var $body  = $('body');
    var $popin = false;
    var transitionEnd = 'webkitTransitionEnd.popin transitionend.popin msTransitionEnd.popin oTransitionEnd.popin';

    /* Public */

    var config = {
        html   : {

            popin : '<div class="popin">'+
                      '<div class="valign"><div class="valign__middle popin__overlay">'+
                      '<div class="popin__content"></div>'+
                      '</div></div>'+
                    '</div>',
            close : '<a class="popin__close"></a>'
        }
    };


    self.context = {
        remove : true
    };


    self.close = function(){ close() };
    self.show  = function(){ show() };
    self.get   = function(){ return $popin };

    /* Contructor. */

    /**
     *
     */
    var construct =  function()
    {
        $popin = $('.popin--'+id);

        if( $popin.length )
        {
            $popin.trigger('popin.show');
        }
        else
        {
            self.context = $.extend(self.context, context);

            if( typeof(content) == "undefined" || content === false )
                content = $('script[type="text/template"]#'+id).html();

            add(content);
            setupEvents();
        }
    };


    /* Private. */

    /**
     *
     */
    var setupEvents = function()
    {
        $popin.click(function(e)
        {
            if( $(e.target).hasClass('popin__overlay') || $(e.target).hasClass('popin__close') || $(e.target).hasClass('popin-close'))
                close();
        });

        $(document).on('click keypress', function(e)
        {
            if ( e.which === 13 )
                close();
        });

        $popin.on('popin.close', function(e) { close() });
        $popin.on('popin.show', function(e) { show() });
    };



    var remove = function()
    {
        if( $popin.length )
            $popin.remove();

        $(document).trigger('popin.removed', [id]);

        $popin = self.context = self = null;
    };


    var close = function()
    {
        if( Modernizr && Modernizr.csstransitions )
        {
            $popin.attr('data-state', 'removing');

            $popin.one(transitionEnd, function()
            {
                if( self.context.remove )
                    remove();
                else
                    $popin.attr('data-state', 'idle');

                if( !$('.popin:visible').length )
                    $html.removeClass('has-popin');

                $body.repaint();
            });
        }
        else
        {
            if( self.context.remove )
                remove();
            else
                $popin.attr('data-state', 'idle');

            if( !$('.popin:visible').length )
                $html.removeClass('has-popin');
        }
    };



    var add = function(content)
    {
        if ( !window.angular )
            content = content.populate(self.context);

        $popin = $(config.html.popin);
        var $content = $popin.find('.popin__content');

        $content.append(content);

        if( !$content.find('.popin__close, .popin-close').length )
            $content.append(config.html.close);

        $html.addClass('has-popin');
        $popin.addClass('popin--'+id);

        $body.append($popin);

        if( 'angular' in window && angular.$injector )
        {
            angular.$injector.invoke(function($compile, $rootScope)
            {
                var scope = $popin.scope() || $rootScope.$new();
                scope = angular.extend(scope, self.context);

                //todo: find why context is not interpolated
                $compile($popin.contents())(scope);
            });
        }

        show();
    };



    var show = function()
    {
        $popin.attr('data-state', '');

        $popin.repaint();

        $popin.attr('data-state', 'adding');

        $(document).trigger('popin.added', [$popin, id, self.context]);

        if( Modernizr && Modernizr.csstransitions )
        {
            $popin.one(transitionEnd, function() { $popin.attr('data-state', 'added') });
        }
        else
        {
            $popin.attr('data-state', 'added');
        }
    };

    construct();

    return self;
};



var MetaPopins = function()
{
    $(document).on('click', '[data-popin]', function(e)
    {
        e.preventDefault();
        var context = {};

        if( $(this).data('context') )
        {
            try { context = $(this).data('context') ? JSON.parse('{' + $(this).data('context').replace(/'/g, '"') + '}') : {}; } catch(e) {}
        }
        else
        {
            context = $(this).data();
        }

        new MetaPopin($(this).data('popin'), false, context);
    });


    if( typeof DOMCompiler !== "undefined" )
    {
        dom.compiler.register('attribute', 'popin', function(elem, attrs)
        {
            elem.attr('data-popin', attrs.popin);

            if( attrs.context )
            {
                elem.attr('data-context', attrs.context);
                elem.removeAttr('context');
            }
        });
    }
};

var meta = meta || {};
meta.popin = new MetaPopins();
