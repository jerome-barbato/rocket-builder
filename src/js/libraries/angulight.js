var angularLight = function(){

    var that = this;

    that.debug = false;

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

        if( that.debug )
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

        if( that.debug ){

            console.log(name, params);
            console.timeEnd('angulight:run')
        }
    };


    that._extendjQuery = function(){

        var html = $.fn.html;
        var append = $.fn.append;
        var prepend = $.fn.prepend;

        $.fn.append = function(){
            var ret = append.apply(this, arguments);
            that._domHasChanged( $(this) );
            return ret;
        };

        $.fn.prepend = function(){
            var ret = prepend.apply(this, arguments);
            that._domHasChanged( $(this) );
            return ret;
        };

        $.fn.html = function(){
            var ret = html.apply(this, arguments);
            that._domHasChanged( $(this) );
            return ret;
        };
    };


    that.__construct = function(){

        that._extendjQuery();
        $(document).on('boot', function(){ that._domHasChanged( $('body')) });
    };


    that._domHasChanged = function( $dom ){

        $dom.find('[data-controller]').each(function(){
            that._run('controller', $(this) );
            $(this).data('controller', false)
        });

        $dom.find('[data-directive]').each(function(){
            that._run('directive', $(this) );
            $(this).data('directive', false);
        });

        $(document).trigger('DOMHasChanged', [$dom]);
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