var angularLight = function(){

    var that = this;

    that.context = {
        controllers : {},
        directives  : {},
        services    : {}
    };

    that.controller = function(id, callback){ that._register('controllers', id, callback) };
    that.directive  = function(id, callback){ that._register('directives', id, callback) };
    that.service    = function(id, callback){ that._register('services', id, callback) };

    that._register = function(type, id, callback){ that.context[type][_.camelCase(id)] = callback };


    that._run = function(type, $element){

        if( !$element.data(type) )
            return;

        $(this).data(type, false);

        if( window._DEBUG && window._DEBUG > 2 )
            console.time('angulight:run');

        var data = $element.data(type).split('(');

        var name   = _.camelCase( data[0] );
        var params = [$element];

       if( data.length == 2  ){

            var raw_params = data[1].replace(')','').split(',');

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

        $(document).on('DOMNodeUpdated', that._domHasChanged );
    };


    that._domHasChanged = function(e, $dom ){

        $dom.each(function(){

            if( $(this).is('[data-controller]') )
                that._run('controller', $(this) );

            if( $(this).is('[data-directive]') )
                that._run('directive', $(this) );
        });

        $dom.find('[data-controller]').each(function(){
            that._run('controller', $(this) );
        });

        $dom.find('[data-directive]').each(function(){
            that._run('directive', $(this) );
        });
    };


    if( typeof DOMCompiler !== "undefined" ){

        dom.compiler.register('attribute', 'controller', function (elem, attrs) {

            elem.attr('data-controller', attrs.controller);
        });

        dom.compiler.register('attribute', 'directive', function (elem, attrs) {

            elem.attr('data-directive', attrs.directive);
        });
    }

    that.__construct();
};

var angulight = new angularLight();