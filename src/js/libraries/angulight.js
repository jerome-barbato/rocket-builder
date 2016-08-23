var angularLight = function(){

    var that = this;

    that.context = {
        controllers : {},
        directives  : {},
        services    : {}
    };

    that.controller = function(id, callback){ that._register('controllers', id, callback) };
    that.directive  = function(id, callback){ that._register('directives', id, callback) };

    that._register  = function(type, id, callback){ that.context[type][_.camelCase(id)] = callback };

    that._run = function(type, $element){

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

        if( typeof that.context[type+'s'][name] != "undefined" ){

            var fct = that.context[type+'s'][name];
            new (Function.prototype.bind.apply(fct, [null].concat(params)));
        }

        if( window._DEBUG && window._DEBUG > 2 ){

            console.log(name, params);
            console.timeEnd('angulight:run')
        }
    };


    that.__construct = function(){

        $('[data-controller]').initialize(function(){
            that._run('controller', $(this) );
        });

        $('[data-directive]').initialize(function(){
            that._run('directive', $(this) );
        });

        $('[data-if]').initialize(function(){

            var condition = $(this).data('if');
            if( condition == "false" || condition == "0" || condition == "" || !condition )
                $(this).remove();

            $(this).removeAttr('data-if');
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

    $(document).ready(that.__construct);
};

var angulight = new angularLight();