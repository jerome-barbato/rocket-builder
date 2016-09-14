var angularLight = function(){

    var self = this;

    self.context = {
        controllers : {},
        directives  : {}
    };

    self.controller = function(id, callback){ self._register('controllers', id, callback) };
    self.directive  = function(id, callback){ self._register('directives', id, callback) };

    self._register  = function(type, id, callback){

        id = _.camelCase(id);

        if( typeof self.context[type][id] != "undefined")
            console.error('Angulight: '+type+' '+id+' allready exist');
        else
            self.context[type][id] = callback
    };

    self._run = function(type, $element){

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

        if( typeof self.context[type+'s'][name] != "undefined" ){

            var fct = self.context[type+'s'][name];
            new (Function.prototype.bind.apply(fct, [null].concat(params)));
        }

        if( window._DEBUG && window._DEBUG > 2 ){

            console.log(name, params);
            console.timeEnd('angulight:run')
        }
    };


    self.__construct = function(){

        $('[data-directive]').initialize(function(){
            self._run('directive', $(this) );
        });

        $('[data-controller]').initialize(function(){
            self._run('controller', $(this) );
        });

        $('[data-if]').initialize(function(){

            var condition = $(this).data('if');
            if( condition == "false" || condition == "0" || condition == "" || !condition )
                $(this).remove();

            $(this).removeAttr('data-if');
        });

        $('[data-if-not]').initialize(function(){

            var condition = $(this).data('if-not');
            if( condition == "true" || condition == "1" || condition )
                $(this).remove();

            $(this).removeAttr('data-if-not');
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

        dom.compiler.register('attribute', 'if-not', function (elem, attrs) {

            elem.attr('data-if-not', attrs.ifNot);
        });
    }

    $(document).ready(self.__construct);
};

var angulight = new angularLight();
var app       = app || {};

app.services = {};