(function($) {

    $.fn.naturalWidth = function() {
        var jsImage = new Image;
        if( "naturalWidth" in jsImage )
            return this[0].naturalWidth;
        else{
            jsImage.src = this.src;
            return jsImage.width;
        }
    };

    $.fn.naturalHeight = function() {
        var jsImage = new Image;
        if( "naturalHeight" in jsImage )
            return this[0].naturalHeight;
        else{
            jsImage.src = this.src;
            return jsImage.height;
        }
    };


    //implement find first level, ex: $('.class').findClosest('p', '.test')
    $.fn.findClosest = function(selector, context_selector) {

        if ("undefined" == typeof context_selector)
            return this.find(selector);

        var $current = this, $child = $();

        this.find(selector).each(function() {

            var $element = $(this);
            if( $element.parent().is($current) || $element.closest(context_selector).is($current) )
                $child = $child.add($element);
        });

        return $child;
    };


    //check if element exists
    $.fn.hasDataAttr = function(attr) {
        return "undefined" != typeof this.data(attr)
    };


    //powerfull remove class $('.test').alterClass('toto--*','titi');
    $.fn.alterClass = function(classname, replacement) {

        var $element = this;

        if (-1 === classname.indexOf("*")) {

            $element.removeClass(classname);

            if (typeof replacement != 'undefined')
                $element.addClass(replacement);
        }
        else
        {
            var s = new RegExp("\\s" + classname.replace(/\*/g, "[A-Za-z0-9-_]+").split(" ").join("\\s|\\s") + "\\s", "g");

            $element.each(function (i, element) {

                for (var t = " " + element.className + " "; s.test(t);)
                    t = t.replace(s, " ");

                element.className = $.trim(t)
            });

            if (typeof replacement != 'undefined')
                $element.addClass(replacement);
        }
    };


    //force browser repaint function, ex: $('.class').repaint()
    $.fn.repaint=function(){ this.length&&this.get(0).offsetHeight };


    //force selector refresh, ex: $toto.refresh()
    $.fn.refresh=function(){ return $(this.selector) };


    //set initialize equal each if not exists
    if(typeof $.fn.initialize == "undefined")
        $.fn.initialize = $.fn.each;

    //play css animation using jQuery
    $.fn.animation = function(animation, duration, easing, callback){

        var ease = { linear: 'cubic-bezier(0.250, 0.250, 0.750, 0.750)', ease: 'cubic-bezier(0.250, 0.100, 0.250, 1.000)', in: 'cubic-bezier(0.420, 0.000, 1.000, 1.000)', out: 'cubic-bezier(0.000, 0.000, 0.580, 1.000)', inOut: 'cubic-bezier(0.420, 0.000, 0.580, 1.000)', inQuad: 'cubic-bezier(0.550, 0.085, 0.680, 0.530)', inCubic: 'cubic-bezier(0.550, 0.055, 0.675, 0.190)', inQuart: 'cubic-bezier(0.895, 0.030, 0.685, 0.220)', inQuint: 'cubic-bezier(0.755, 0.050, 0.855, 0.060)', inSine: 'cubic-bezier(0.470, 0.000, 0.745, 0.715)', inExpo: 'cubic-bezier(0.950, 0.050, 0.795, 0.035)', inCirc: 'cubic-bezier(0.600, 0.040, 0.980, 0.335)', inBack: 'cubic-bezier(0.600, -0.280, 0.735, 0.045)', outQuad: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)', outCubic: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)', outQuart: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)', outQuint: 'cubic-bezier(0.230, 1.000, 0.320, 1.000)', outSine: 'cubic-bezier(0.390, 0.575, 0.565, 1.000)', outExpo: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)', outCirc: 'cubic-bezier(0.075, 0.820, 0.165, 1.000)', outBack: 'cubic-bezier(0.175, 0.885, 0.320, 1.275)', inOutQuad: 'cubic-bezier(0.455, 0.030, 0.515, 0.955)', inOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1.000)', inOutQuart: 'cubic-bezier(0.770, 0.000, 0.175, 1.000)', inOutQuint: 'cubic-bezier(0.860, 0.000, 0.070, 1.000)', inOutSine: 'cubic-bezier(0.445, 0.050, 0.550, 0.950)', inOutExpo: 'cubic-bezier(1.000, 0.000, 0.000, 1.000)', inOutCirc: 'cubic-bezier(0.785, 0.135, 0.150, 0.860)', inOutBack: 'cubic-bezier(0.680, -0.550, 0.265, 1.550)' };

        var animation_event = 'animationend.fn_animation oanimationend.fn_animation webkitAnimationEnd.fn_animation MSAnimationEnd.fn_animation';

        if( typeof animation == 'function'){

            callback = animation;
            animation = false;
        }

        if( animation && typeof duration == 'function'){

            callback = duration;
            duration = '0.3s';
        }

        if( animation && typeof easing == 'function' ){

            callback = easing;
            easing = 'inOutCubic';
        }

        if( animation && typeof duration == 'undefined')
            duration = '0.3s';

        if( animation && typeof easing == 'undefined' )
            easing = 'inOutCubic';

        if( !easing in ease )
            easing = 'inOutCubic';

        var $element = $(this);

        $element.one(animation_event, function(e){

            $element.css('animation', '');
            $element.unbind(animation_event);

            if( callback )
                callback.call(this);
        });

        if( animation )
            $element.css('animation', animation+' '+duration+' '+ease[easing]);

        $element.show();
    };


    $.fn.realOffset = function(){

        var $element = $(this);
        var el = $element.get(0);

        var _x = 0; var _y = 0;

        while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {

            _x += el.offsetLeft;
            _y += el.offsetTop;
            el = el.offsetParent;

        }

        return { top: _y, left: _x };
    };


    /**
     * Create Form Object from Array
     * @see serializeArray
     * @returns {{}}
     */
    $.fn.serializeObject = function() {

        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };


    /**
     * Interpolate string from object
     */
    $.fn.interpolate = function(content) {

        this.each(function(){
            $(this).text( $(this).text().populate(content) );
        });
    };


	if (typeof $.fn.initialize == "undefined")
		$.fn.initialize = $.fn.each;

})(jQuery);