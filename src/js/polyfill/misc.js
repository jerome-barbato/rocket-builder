//implement string repeat
String.prototype.repeat = function(num) {
    return new Array(isNaN(num)? 1 : ++num).join(this);
};

/**
 * Replace double brackets fields in String with data values.
 * @param data values to assign.
 */
String.prototype.populate = function(data) {
    var content = this.toString();
    $.each(data, function(id, key){

        if( Array.isArray(key) )
            key = key.join('|');

        content = content.split('[['+id+']]').join(key);
    });

    return content;
};

/**
 * Number.prototype.format(n, x)
 *
 * @param integer n: length of decimal
 * @param integer x: section separator
 */
Number.prototype.format = function(n, x) {
    var re = '\\d(?=(\\d{' + (3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$& ');
};



if (typeof console == "undefined") {
    window.console = {
        log: function () {}
    };
}



if (typeof Modernizr == "undefined") {
    window.Modernizr = false;
}



// Generate unique ID
function guid( prefix ) {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return prefix + '_'+ s4() + s4();
}