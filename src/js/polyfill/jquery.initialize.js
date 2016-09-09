//add DOMNodeUpdated event for jQuery

(function(){

    if(window.angular && window.jQuery) {

        $.fn.initialize = function(){ };
    }
    else if(window.jQuery) {

        var replaceWith = $.fn.replaceWith;
        var html        = $.fn.html;
        var append      = $.fn.append;
        var prepend     = $.fn.prepend;
        var after       = $.fn.after;
        var before      = $.fn.before;

        var hasContainer = function( content ){

            var is_string = typeof content == "string";

            if( !is_string )
                return false;

            var has_container = content.charAt(0) == '<' && content.slice(-1) == '>';

            if( !has_container && content.indexOf('<') >=0 && typeof app != 'undefined' && app.debug )
                console.warn('Initialize: You are manipulating an element without container, initialize will not run');

            return has_container;
        };

        var updateDom = function (fct, args, context) {

            var ret = false;

            if( args.length && typeof args[0] != "undefined" ){

                //todo: better regexp to replace indexOf('<')

                // Convert argument to jQuery instance

                /*<div class="">
                 <youtube href="mylink"/>
                See link below
                <youtube href="mylink"/>ee link below<a>dd</a>
                 */

                if ( args[0] instanceof $ || hasContainer( args[0] ) ) {

                    args[0] = args[0] instanceof $ ? args[0] : $(args[0]);
                    ret = fct.apply(context, args);

                    $(document).trigger('DOMNodeUpdated', args);

                } else {

                    ret = fct.apply(context, args);
                }
                /*
                if( typeof args[0] == "string" && args[0].indexOf('<') == -1 ){

                    ret = fct.apply(context, args);
                }
                else{

                    args[0] = args[0] instanceof $ ? args[0] : $(args[0]);
                    ret = fct.apply(context, args);

                    $(document).trigger('DOMNodeUpdated', args);
                }
                */
            }
            else{

                ret = fct.apply(context, args);
            }

            return ret;
        };

        $.fn.html        = function () { return updateDom(html, arguments, this) };
        $.fn.replaceWith = function () { return updateDom(replaceWith, arguments, this) };
        $.fn.append      = function () { return updateDom(append, arguments, this) };
        $.fn.prepend     = function () { return updateDom(prepend, arguments, this) };
        $.fn.after       = function () { return updateDom(after, arguments, this) };
        $.fn.before      = function () { return updateDom(before, arguments, this) };

        $(document).ready(function(){
            $(document).trigger('DOMNodeUpdated', [$('body'), 'initialize']);
        });

        $.fn.initialized = function(){
            return typeof $(this).data('initialized') != "undefined" && $(this).data('initialized');
        };

        var initialize = function(callback){

            var $elem = $(this);

            if( typeof $elem.data('initialized') == "undefined" && !$elem.parents('template').length && !$elem.is('template') ){

                $elem.data('initialized', true);
                callback.call(this);
            }
        };

        $.fn.initialize = function(callback){

            $(this).each(function(){

                initialize.call(this, callback);
            });

            var selector = this.selector;

            $(document).on('DOMNodeUpdated', function(e, $node){

                if( window._DEBUG && window._DEBUG > 3 )
                    console.info('Initialize '+selector);

                $node.each(function () {

                    if( $(this).is(selector) )
                        initialize.call(this, callback);
                });

                $node.find(selector).each(function(){
                    initialize.call(this, callback);
                });
            })
        };
    }
})();

