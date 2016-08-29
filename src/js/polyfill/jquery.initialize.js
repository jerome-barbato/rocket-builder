//add DOMNodeUpdated event for jQuery

(function(){

    if(window.angular && window.jQuery) {

        $.fn.initialize = function(){ };
    }
    else if(window.jQuery) {

        var html    = $.fn.html;
        var append  = $.fn.append;
        var prepend = $.fn.prepend;
        var after   = $.fn.after;
        var before  = $.fn.before;

        var updateDom = function (fct, args, context) {

            var ret = false;

            if( args.length && typeof args[0] != "undefined" ){

                //todo: better regexp to replace indexOf('<')
                if( typeof args[0] == "string" && args[0].indexOf('<') == -1 ){

                    ret = fct.apply(context, args);
                }
                else{

                    args[0] = args[0] instanceof $ ? args[0] : $(args[0]);
                    ret = fct.apply(context, args);

                    $(document).trigger('DOMNodeUpdated', args);
                }
            }
            else{

                ret = fct.apply(context, args);
            }

            return ret;
        };

        $.fn.html    = function () { return updateDom(html, arguments, this) };
        $.fn.append  = function () { return updateDom(append, arguments, this) };
        $.fn.prepend = function () { return updateDom(prepend, arguments, this) };
        $.fn.after   = function () { return updateDom(after, arguments, this) };
        $.fn.before  = function () { return updateDom(before, arguments, this) };

        $(document).ready(function(){
            if( typeof DOMCompiler == "undefined" )
                $(document).trigger('DOMNodeUpdated', [$('body')]);
        });

        $.fn.initialized = function(){
            return typeof $(this).data('initialized') != "undefined" && $(this).data('initialized');
        };

        var initialize = function(callback){
            var $elem = $(this);
            if( typeof $elem.data('initialized') == "undefined" ){

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