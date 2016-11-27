var angularLight = function(){

    var self = this;

    self.context = {
        controllers : {},
        instances   : {},
        templates   : {}
    };

    self.controller = function(id, callback){ self._register('controller', id, callback) };

    self.template   = function(id){

        return (id in self.context.templates) ? self.context.templates[id]: '';
    };

    self.camelCase = function(str) {
        return str
            .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
            .replace(/\s/g, '')
            .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
    };


    self._register  = function(type, id, callback){

        id = self.camelCase(id);

        if( typeof self.context[type+'s'][id] != "undefined")
            console.error('Angulight: '+type+' '+id+' allready exist');
        else
            self.context[type+'s'][id] = callback;

        self._run( type, $('[data-'+type+'="'+id+'"], [data-'+type+'^="'+id+'("]'));
    };


    self._run = function(type, $element){

        if( typeof $element == "undefined" || !$element || !$element.length )
            return false;

        var data   = $element.data(type).split('(');
        var name   = self.camelCase( data[0] );
        var params = [$element];

       if( data.length == 2  ){

            var raw_params = data[1].replace(')','').replace(", '",",'").replace("' ,","',").split(',');

            for(var i=0; i<raw_params.length; i++){

                if( raw_params[i].substr(0,1) == '"' || raw_params[i].substr(0,1) == "'" )
                    raw_params[i] = raw_params[i].replace(/"/g,'').replace(/'/g,'');
                else if( raw_params[i] == "false" )
                    raw_params[i] = false;
                else if( raw_params[i] == "true" )
                    raw_params[i] = true;
                else
                    raw_params[i] = parseFloat(raw_params[i]);
            }

           params = params.concat(raw_params);
       }

        if( type == 'repeater' ) {

            var $controller = $element.parents('[data-controller]');
            if( $controller.length ){

                var instance_id = $controller.data('angulight-instance');
                if( instance_id in self.context.instances ){

                    var instance = self.context.instances[instance_id];

                    if( name in instance ){

                        var template_id = $element.data('name');
                        params[0] = typeof template_id != 'undefined' ? self.context.templates[ template_id ] : $element.html();
                        $element.replaceWith( instance[name].apply(null, params) );
                    }
                }
            }
        }
        else{

            if( name in self.context[type+'s'] ){

                if( app.debug > 2 )
                    console.time('angulight:run');

                var fct = self.context[type+'s'][name];
                var instance = self._guid();

                $element.data('angulight-instance', instance);
                self.context.instances[instance] = new (Function.prototype.bind.apply(fct, [null].concat(params)));


                if( app.debug > 2 ){

                    console.log(name, params);
                    console.timeEnd('angulight:run')
                }
            }
        }
    };


    self._guid = guid || function() {

        var s4 = function() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        return s4() + s4();
    };


    self.__construct = function(){

        $('template[id]').each(function(){
            self.context.templates[ $(this).attr('id') ] = $(this).html();
        });


        $('[data-controller]').initialize(function(){
            self._run('controller', $(this) );
        });


        $('[data-repeater]').initialize(function(){
            self._run('repeater', $(this) );
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

        dom.compiler.register('attribute', 'controller', function(elem, attrs) {

            elem.attr('data-controller', attrs.controller);
        });

        // Compatibility
        dom.compiler.register('attribute', 'directive', function(elem, attrs) {

            console.log('Angulight directive has been removed please une controller instead');
            elem.attr('data-controller', attrs.directive);
        });

        dom.compiler.register('attribute', 'repeater', function(elem, attrs) {

            elem.attr('data-repeater', attrs.repeater);

            if( 'name' in attrs )
                elem.attr('data-name', attrs.name);
        });

        dom.compiler.register('attribute', 'if', function(elem, attrs) {

            elem.attr('data-if', attrs.if);
        });

        dom.compiler.register('attribute', 'if-not', function(elem, attrs) {

            elem.attr('data-if-not', attrs.ifNot);
        });
    }

    self.__construct();
};

var app       = app || {};
app.services  = app.services || {};

var angulight = new angularLight();
