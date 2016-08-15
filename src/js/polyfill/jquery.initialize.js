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

            if (args.length)
                args[0] = args[0] instanceof $ ? args[0] : $(args[0]);
            var ret = fct.apply(context, args);
            if (args.length)
                $(document).trigger('DOMNodeUpdated', args);
            return ret;
        };

        $.fn.html    = function () { return updateDom(html, arguments, this) };
        $.fn.append  = function () { return updateDom(append, arguments, this) };
        $.fn.prepend = function () { return updateDom(prepend, arguments, this) };
        $.fn.after   = function () { return updateDom(after, arguments, this) };
        $.fn.before  = function () { return updateDom(before, arguments, this) };

        $(document).ready(function(){
            if( typeof DOMCompiler =="undefined" )
                $(document).trigger('DOMNodeUpdated', [$('body')]);
        });

        $.fn.initialized = function(){
            return typeof $(this).data('initialized') != "undefined" && $(this).data('initialized');
        };

        $.fn.initialize = function(callback){

            $(this).each(function(){
                if( typeof $(this).data('initialized') == "undefined" )
                    callback.call(this);
            });

            var selector = this.selector;

            $(document).on('DOMNodeUpdated', function(e, $node){

                if( _DEBUG )
                    console.info('Initialize '+selector);

                $node.each(function () {

                    if( $(this).is(selector) && typeof $(this).data('initialized') == "undefined" ){

                        $(this).data('initialized', true);
                        callback.call(this);
                    }
                });

                $node.find(selector).each(function(){
                    if( typeof $(this).data('initialized') == "undefined" )
                        callback.call(this);
                });
            })
        };
    }
})();