/**
 * Popin
 *
 * Copyright (c) 2016 - Metabolism
 * Author:
 *   - Metabolism <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 1.0
 *
 * Requires:
 *   - jQuery
 *
 * Changelog:
 *
 *
 **/
var UIRouter = function(){

    var that = this;


    /* Public */

    that.config = {
        animations : {
            enter:'fade-in',
            leave:'fade-out'
        },
        scroll_to_top:false
    };

    that.context = {
        pages : false,
        current_path  : '',
        previous_path : '',
        animation_end : 'animationend.ui-router oanimationend.ui-router webkitAnimationEnd.ui-router MSAnimationEnd.ui-router'
    };


    /* Contructor. */

    that.__construct =  function(){

        $(window).on('hashchange', function() {

            that.gotoPath( that._getPath(), function(){

                if( that.config.scroll_to_top )
                    $(window).scrollTop(0);
            } );
        });

        that.context.pages    = $('.ui-router');
        that.context.triggers = $('[href^="#/"]');

        if( location.hash )
            that.gotoPath( that._getPath() );
        else
            location.hash = that._findDefaultPath();
    };


    /* Private */

    that._setActiveTriggers = function(){

        $('body').removeClass('ui-route--' + that.context.previous_path.replace(/\//g, '_')).addClass('ui-route--' + that.context.current_path.replace(/\//g, '_'));

        that.context.triggers.removeClass('ui-route--active');

        var path  = [];

        $.each(that.context.current_path.split('/'), function(index, element){

            path.push(element);
            that.context.triggers.filter('[href="#/' + path.join('/') + '"]').addClass('ui-route--active');
        })
    };


    that.gotoPath = function( path, callback ) {

        var $page = that.context.pages.filter("[data-page='" + path + "']");

        if( path && path.length && $page.length ){

            var $subpage = $page.find('.ui-router--default');
            var loaded_pages = 0;

            if( $subpage.length ){

                location.hash = '/'+$subpage.first().data('page');
            }
            else {

                that.context.previous_path = that.context.current_path;
                that.context.current_path  = path;

                that._setActiveTriggers();

                path = path.split('/');

                var previous_path = that.context.previous_path.split('/');

                var complete_prev_path = [];
                var complete_new_path  = [];

                $.each(path, function (index, new_path) {

                    complete_new_path.push(new_path);

                    if (previous_path.length > index) {

                        complete_prev_path.push(previous_path[index]);

                        if (previous_path[index] != new_path) {

                            that._unloadPage(complete_prev_path.join('/'));
                            previous_path = [];
                        }
                    }

                    if (previous_path.length < index || previous_path[index] != new_path){

                        that._loadPage(complete_new_path.join('/'));
                        loaded_pages++;

                        if( loaded_pages == path.length && callback )
                            callback()
                    }
                })
            }
        }
    };


    that._unloadPage = function( path, callback ) {

        var $page       = that.context.pages.filter("[data-page='" + path + "']");
        var leave_class = 'ui-router--animate ui-router--'+that.config.animations.leave+' ui-router--leave';

        var unloadComplete = function(){

            $page.removeClass('ui-router--current'+' '+leave_class);
            $page.find('.ui-router').removeClass('ui-router--current');

            if( ui && ui.activation )
                ui.activation.reset($page);

            if( callback ) callback();
        };

        if( $page && $page.length ){

            if( that.config.animations && that.config.animations.leave ){

                $page.unbind(that.context.animation_end).one(that.context.animation_end, unloadComplete);
                $page.addClass(leave_class);
            }
            else{

                unloadComplete();
            }
        }
    };


    that._loadPage = function( path, callback ) {

        var $page = that.context.pages.filter("[data-page='" + path + "']");

        if ( $page ) {

            if( that.config.animations && that.config.animations.enter ){

                var enter_class = 'ui-router--animate ui-router--'+that.config.animations.enter+' ui-router--enter';
                $page.unbind(that.context.animation_end).one(that.context.animation_end, function(){

                    $page.removeClass(enter_class);

                    setTimeout(function(){ $(document).trigger('ui-router.hasChanged'); $(window).resize() });

                    if( callback ) callback();
                });

                $page.addClass('ui-router--current'+' '+enter_class);
            }
            else{

                $page.addClass('ui-router--current');

                setTimeout(function(){ $(document).trigger('ui-router.hasChanged'); $(window).resize() });

                if( callback ) callback();
            }
        }
    };


    that._findDefaultPath = function( $page ) {

        var path = '';

        if( typeof $page == "undefined" )
            $page = $('body');

        if( $page.length ){

            if( $page.hasClass('ui-router') )
                path = $page.data('page');

            var $subpage = $page.find(".ui-router--default").first();

            if( $subpage.length )
                return that._findDefaultPath( $subpage )
        }

        return '/'+path;
    };


    that._getPath = function() {

        var path = false;

        if ( location.hash )
            path  = location.hash.replace("#/", "");

        if( that.context.current_path != path )
            return path;

        return false;
    };



    if( typeof DOMCompiler !== "undefined" ) {

        dom.compiler.register('attribute', 'page', function (elem, attrs) {

            var $parent = elem.parents('.ui-router');
            elem.addClass('ui-router');
            elem.attr('data-page', $parent.length?$parent.data('page')+'/'+attrs.page:attrs.page);

            if( typeof attrs.default !== "undefined" ){

                elem.addClass('ui-router--default');
                elem.removeAttr('default');
            }
        });
    }

    $(document).on('boot', that.__construct);
};


var ui = ui || {};
ui.router = new UIRouter();