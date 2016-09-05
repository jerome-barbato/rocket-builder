//force browser repaint function, ex: $('.class').repaint()
window.jQuery&&(window.jQuery.fn.repaint=function(){this.length&&this.get(0).offsetHeight});


//force selector refresh, ex: $toto.refresh()
window.jQuery&&(window.jQuery.fn.refresh=function(){return $(this.selector)});


//implement find first level, ex: $('.class').findClosest('p')
!function(n,e,t,s){var a=e.jQuery;a&&(a.fn.findClosest=function(n,e){if("undefined"==typeof e)return this.find(n);var t=this,s=this.find(n),a=$();return s.each(function(){var n=$(this);(n.parent().is(t)||n.closest(e).is(t))&&(a=a.add(n))}),a},a.fn.hasDataAttr=function(n){return"undefined"!=typeof this.data(n) && this.data(n).length},a.fn.alterClass=function(n,e){var t=this;if(-1===n.indexOf("*"))return t.removeClass(n),e?t.addClass(e):t;var s=new RegExp("\\s"+n.replace(/\*/g,"[A-Za-z0-9-_]+").split(" ").join("\\s|\\s")+"\\s","g");return t.each(function(n,e){for(var t=" "+e.className+" ";s.test(t);)t=t.replace(s," ");e.className=$.trim(t)}),e?t.addClass(e):t})}(window.jQuery||window,window,document);


//natural image dimension for image loaded, ex: $('.class').naturalHeight(), $('.class').naturalWidth()
!function(n){function t(n){var t=new Image;return t.src=n,t}return"naturalWidth"in new Image?(n.fn.naturalWidth=function(){return this[0].naturalWidth},void(n.fn.naturalHeight=function(){return this[0].naturalHeight})):(n.fn.naturalWidth=function(){return t(this.src).width},void(n.fn.naturalHeight=function(){return t(this.src).height}))}(jQuery);


if(window.jQuery && typeof $.fn.initialize == "undefined")
    $.fn.initialize = $.fn.each;

if (window.jQuery) {

    $.fn.animation = function(animation, duration, easing, callback){

        var ease = { linear: 'cubic-bezier(0.250, 0.250, 0.750, 0.750)', ease: 'cubic-bezier(0.250, 0.100, 0.250, 1.000)', easeIn: 'cubic-bezier(0.420, 0.000, 1.000, 1.000)', easeOut: 'cubic-bezier(0.000, 0.000, 0.580, 1.000)', easeInOut: 'cubic-bezier(0.420, 0.000, 0.580, 1.000)', easeInQuad: 'cubic-bezier(0.550, 0.085, 0.680, 0.530)', easeInCubic: 'cubic-bezier(0.550, 0.055, 0.675, 0.190)', easeInQuart: 'cubic-bezier(0.895, 0.030, 0.685, 0.220)', easeInQuint: 'cubic-bezier(0.755, 0.050, 0.855, 0.060)', easeInSine: 'cubic-bezier(0.470, 0.000, 0.745, 0.715)', easeInExpo: 'cubic-bezier(0.950, 0.050, 0.795, 0.035)', easeInCirc: 'cubic-bezier(0.600, 0.040, 0.980, 0.335)', easeInBack: 'cubic-bezier(0.600, -0.280, 0.735, 0.045)', easeOutQuad: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)', easeOutCubic: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)', easeOutQuart: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)', easeOutQuint: 'cubic-bezier(0.230, 1.000, 0.320, 1.000)', easeOutSine: 'cubic-bezier(0.390, 0.575, 0.565, 1.000)', easeOutExpo: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)', easeOutCirc: 'cubic-bezier(0.075, 0.820, 0.165, 1.000)', easeOutBack: 'cubic-bezier(0.175, 0.885, 0.320, 1.275)', easeInOutQuad: 'cubic-bezier(0.455, 0.030, 0.515, 0.955)', easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1.000)', easeInOutQuart: 'cubic-bezier(0.770, 0.000, 0.175, 1.000)', easeInOutQuint: 'cubic-bezier(0.860, 0.000, 0.070, 1.000)', easeInOutSine: 'cubic-bezier(0.445, 0.050, 0.550, 0.950)', easeInOutExpo: 'cubic-bezier(1.000, 0.000, 0.000, 1.000)', easeInOutCirc: 'cubic-bezier(0.785, 0.135, 0.150, 0.860)', easeInOutBack: 'cubic-bezier(0.680, -0.550, 0.265, 1.550)' };

        if( typeof duration == 'function'){

            callback = duration;
            duration = '0.3s';
        }

        if( typeof easing == 'function' ){

            callback = easing;
            easing = 'easeInOutCubic';
        }

        if( typeof duration == 'undefined')
            duration = '0.3s';

        if( typeof easing == 'undefined' )
            easing = 'easeInOutCubic';

        $(this).one('animationend.$ oanimationend.$ webkitAnimationEnd.$ MSAnimationEnd.$', function(){

            if( callback )
                callback.call(this);

        }).css('animation', animation+' '+duration+' '+ease[easing]);
    };
}

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