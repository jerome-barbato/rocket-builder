
/**
 * Implement string repeat
 * @param num loop count
 */
String.prototype.repeat = function(num) {
    return new Array(isNaN(num)? 1 : ++num).join(this);
};

/**
 * Replace double brackets fields in String with data values.
 * @param data values to assign.
 */
String.prototype.populate = function(data) {
    var content = this.toString();

    for(var key in data){

        if(!data.hasOwnProperty(key)) continue;

        var value = data[key];
        if( Array.isArray(value) )
            value = value.join('|');

        content = content.split('[['+key+']]').join(value);
    }

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



if (typeof console == "undefined")
    window.console = { log: function() {}, time: function() {}, error: function() {}};



if (typeof Modernizr == "undefined")
    window.Modernizr = false;



// Generate unique ID
window.guid = function( prefix ) {

    var s4 = function() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };

    return (typeof prefix != 'undefined' ? prefix + '_' : '' )+ s4() + s4();
};