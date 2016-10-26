//add DOMNodeUpdated event for jQuery

(function(){

    if( window.angular || window.precompile ) {

        if( window.jQuery ){

            $.fn.initialize = function(){};
        }
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

            if( !has_container && content.indexOf('<') >=0 && typeof app != 'undefined' && 'debug' in app && app.debug > 2 )
                console.warn('Initialize: You are manipulating an element without container, initialize will not run');

            return has_container;
        };

        var updateDom = function(fct, args, context) {

            var ret = false;

            if( context.length && args.length && typeof args[0] != "undefined" ){

                //todo: better regexp to replace indexOf('<')

                if ( args[0] instanceof $ || hasContainer( args[0] ) ) {

                    args[0] = args[0] instanceof $ ? args[0] : $(args[0]);
                    ret = fct.apply(context, args);

                    if( args.length > 1 && args[1] !== false )
                        $(document).trigger('DOMNodeUpdated', args);

                } else {

                    ret = fct.apply(context, args);
                }
            }
            else{

                ret = fct.apply(context, args);
            }

            return ret;
        };

        $.fn.html        = function() { return updateDom(html, arguments, this) };
        $.fn.replaceWith = function() { return updateDom(replaceWith, arguments, this) };
        $.fn.append      = function() { return updateDom(append, arguments, this) };
        $.fn.prepend     = function() { return updateDom(prepend, arguments, this) };
        $.fn.after       = function() { return updateDom(after, arguments, this) };
        $.fn.before      = function() { return updateDom(before, arguments, this) };

        $(document).ready(function(){
            $(document).trigger('DOMNodeUpdated', [$('body'), 'initialize']);
        });

        $.fn.initialized = function(){
            return typeof $(this).data('initialized') != "undefined" && $(this).data('initialized');
        };

        var initialize = function(selector, callback){

            var $elem = $(this);

            var initialized = typeof $elem.data('initialized') != 'undefined' ? JSON.parse($elem.data('initialized')) : [];

            if( (!initialized.length || initialized.indexOf(selector) == -1 ) && !$elem.parents('template').length && !$elem.is('template') ){

                initialized.push(selector);

                $elem.data('initialized', JSON.stringify(initialized));

                callback.call(this);
            }
        };

        $.fn.initialize = function(callback){

            if( typeof callback != 'undefined' ) {

                var selector = this.selector;

                if (typeof app != 'undefined' && 'debug' in app && app.debug > 3)
                    console.info('Initialize ' + selector);

                $(this).each(function(){

                    initialize.call(this, selector, callback);
                });

                $(document).on('DOMNodeUpdated', function (e, $node) {

                    if (typeof app != 'undefined' && 'debug' in app && app.debug > 3)
                        console.info('DOMNodeUpdated triggered for ' + selector, $node);

                    $node.each(function () {

                        if ($(this).is(selector))
                            initialize.call(this, selector, callback);
                    });

                    $node.find(selector).each(function () {
                        initialize.call(this, selector, callback);
                    });

                });
            }
            else{

                $(document).trigger('DOMNodeUpdated', [$(this), 'initialize']);
            }
        };
    }
})();

