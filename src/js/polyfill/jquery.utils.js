//repaint function
if (window.jQuery) {

    window.jQuery.fn.repaint = function(){

        if(this.length)
            this.get(0).offsetHeight;
    };

    window.jQuery.fn.refresh = function() {
        return $(this.selector);
    };
}

//implement find first level
!function(n,e,t,s){var a=e.jQuery;a&&(a.fn.findClosest=function(n,e){if("undefined"==typeof e)return this.find(n);var t=this,s=this.find(n),a=$();return s.each(function(){var n=$(this);(n.parent().is(t)||n.closest(e).is(t))&&(a=a.add(n))}),a},a.fn.hasDataAttr=function(n){return"undefined"!=typeof this.data(n) && this.data(n).length},a.fn.alterClass=function(n,e){var t=this;if(-1===n.indexOf("*"))return t.removeClass(n),e?t.addClass(e):t;var s=new RegExp("\\s"+n.replace(/\*/g,"[A-Za-z0-9-_]+").split(" ").join("\\s|\\s")+"\\s","g");return t.each(function(n,e){for(var t=" "+e.className+" ";s.test(t);)t=t.replace(s," ");e.className=$.trim(t)}),e?t.addClass(e):t})}(window.jQuery||window,window,document);