jQuery.fn.hasDataAttr = function(attr) {
	return "undefined" != typeof this.data(attr)
};

var grid_breakpoints = ['phone', 'tablet', 'small', 'medium', 'large', '4k'];

var camelCase = function(str) {

	return str
		.replace(/-/g, ' ')
		.replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
		.replace(/\s/g, '')
		.replace(/^(.)/, function($1) { return $1.toLowerCase(); });
};