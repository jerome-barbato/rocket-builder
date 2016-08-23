var angularLight = function(){

    var that = this;

    var context = {
        controllers : {},
        directives  : {},
        services    : {}
    };

    that.controller = function(id, callback){ register('controllers', id, callback) };
    that.directive  = function(id, callback){ register('directives', id, callback) };

    var register  = function(type, id, callback){ context[type][_.camelCase(id)] = callback };

    var run = function(type, $element){

        if( window._DEBUG && window._DEBUG > 2 )
            console.time('angulight:run');

        var data = $element.data(type).split('(');

        var name   = _.camelCase( data[0] );
        var params = [$element];

       if( data.length == 2  ){

            var raw_params = data[1].replace(')','').replace(", '",",'").replace("' ,","',").split(',');

            for(var i=0; i<raw_params.length; i++){

                if( raw_params[i].substr(0,1) == '"' || raw_params[i].substr(0,1) == "'" )
                    raw_params[i] = raw_params[i].replace(/"/g,'').replace(/'/g,'');
                else if( raw_params[i] == "false" )
                    raw_params[i] = false;
                else if( raw_params[i] == "true" )
                    raw_params[i] = false;
                else
                    raw_params[i] = parseFloat(raw_params[i]);
            }

           params = params.concat(raw_params);
       }

        if( typeof context[type+'s'][name] != "undefined" ){

            var fct = context[type+'s'][name];
            new (Function.prototype.bind.apply(fct, [null].concat(params)));
        }

        if( window._DEBUG && window._DEBUG > 2 ){

            console.log(name, params);
            console.timeEnd('angulight:run')
        }
    };


    var __construct = function(){

        $('[data-controller]').initialize(function(){
            run('controller', $(this) );
        });

        $('[data-directive]').initialize(function(){
            run('directive', $(this) );
        });

        $('[data-if]').initialize(function(){

            var condition = $(this).data('if');
            if( condition == "false" || condition == "0" || condition == "" || !condition )
                $(this).remove();
        });
    };


    if( typeof DOMCompiler !== "undefined" ){

        dom.compiler.register('attribute', 'controller', function (elem, attrs) {

            elem.attr('data-controller', attrs.controller);
        });

        dom.compiler.register('attribute', 'directive', function (elem, attrs) {

            elem.attr('data-directive', attrs.directive);
        });

        dom.compiler.register('attribute', 'if', function (elem, attrs) {

            elem.attr('data-if', attrs.if);
        });
    }

    $(document).ready(__construct);
};

var angulight = new angularLight();