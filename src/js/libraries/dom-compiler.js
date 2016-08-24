/**
 * DOM Extensions Compiler
 *
 * Copyright (c) 2016 - Metabolism
 * Author:
 *   - Jérome Barbato <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 3
 *
 * Requires:
 *   - jQuery
 *
 **/

var DOMCompiler = function(){

    var self = this;

    self.dom_attributes         = [];
    self.dom_attributes_filters = [];
    self.dom_elements           = [];


    self.attr = function(elem, attr, value){

        if( window.precompile )
            elem.attr('data-'+attr, value);
        else
            elem.data(attr, value);
    };


    self._getAttributes = function(element){

        var attributes = {};

        for(var i=0; i<element.attributes.length; i++){

            var value = element.attributes[i].value;

            if( window.precompile )
                value = value.replace(/\{\{ /g, '{{').replace(/ \}\}/g, '}}').replace(/ \? /g, '?').replace(/ : /g, ':').replace(/ \| /g, '|').replace(/ ~ /g, '~');

            attributes[_.camelCase(element.attributes[i].name)] = value;
        }

        return attributes;
    };



    self._compileAttributes = function($dom){

        self.dom_attributes.forEach(function(dom_attribute){

            var compiler = _.camelCase(dom_attribute);

            if( $dom.is('['+dom_attribute+']') )
                self[compiler]($dom, self._getAttributes($dom[0]) );

            $dom.find('['+dom_attribute+']').each(function(){

                self[compiler]( $(this), self._getAttributes(this) );
            });
        });
    };



    self._compileAttributesFilters = function($dom){

        self.dom_attributes_filters.forEach(function(dom_attributes_filter){

            var compiler = _.camelCase(dom_attributes_filter);

            $dom.find('['+dom_attributes_filter+']').each(function(){

                self[compiler]( $(this), self._getAttributes(this) );
            });
        });
    };



    self._compileElement = function(dom, dom_element){

        var compiler = _.camelCase(dom_element);

        var $template = $(self[compiler]($(dom), self._getAttributes(dom)));
        var html      = $(dom).html();

        $template.find('transclude').replaceWith(html);

        for(var i=0; i<dom.attributes.length; i++){

            if( dom.attributes[i].name != 'class' ) {
                if (dom.attributes[i].name != 'context')
                    $template.attr(dom.attributes[i].name, dom.attributes[i].value);
            }
            else
                $template.addClass(dom.attributes[i].value);
        }

        self._compileElements($template);

        $(dom).replaceWith($template);
    };


    self._compileElements = function($dom){

        self.dom_elements.forEach(function(dom_element){

            if( $dom.is(dom_element) )
                self._compileElement($dom[0], dom_element);

            $dom.find(dom_element).each(function(){
                self._compileElement(this, dom_element)
            });
        });
    };



    self._cleanAttributes = function($dom){

        self.dom_attributes.forEach(function (dom_attribute) {

            if( $dom.is('[' + dom_attribute + ']') )
                $dom.removeAttr(dom_attribute);

            $dom.find('[' + dom_attribute + ']').each(function () {

                $(this).removeAttr(dom_attribute);
            });
        });
    };



    self.run = function( $dom ){

        var raw_init = $dom.html();

        if( window._DEBUG )
            console.time('dom compilation');

        $dom = $dom.not('template');

        self._compileElements($dom);
        self._compileAttributes($dom);
        self._compileAttributesFilters($dom);

        self._cleanAttributes($dom);

        if( raw_init != $dom.html() ){
            setTimeout(function(){ $(document).trigger('DOMNodeUpdated', [$dom, 'dom-compiler']) });
        }

        if( window._DEBUG ){

            console.timeEnd('dom compilation');
            console.info('dom element count : '+($dom.find('*').length+$dom.length));
        }
    };



    self.register = function(type, attribute, link, main){

        var name = _.camelCase(attribute);

        switch (type){

            case 'attribute':

                self.dom_attributes.push(attribute);
                self._addAngularDirective('A', name, link, main, self.dom_attributes.length);
                break;

            case 'filter':

                self.dom_attributes_filters.push(attribute);
                self._addAngularDirective('F', name, link, main, self.dom_attributes_filters.length);
                break;

            case 'element':

                self.dom_elements.push(attribute);
                self._addAngularDirective('E', name, link, main, self.dom_elements.length);
                break;
        }

        DOMCompiler.prototype[name] = link;
    };



    self._addAngularDirective = function(restrict, name, link, main, priority){

        if( !window.angular ) return;

        if( restrict == "A" || restrict == "F" ){

            self.angular_module.directive(name, [function() {
                return {
                    restrict: "A", scope: false, priority:1000-priority,
                    link: {
                        pre: function(scope, elem, attrs) { link(elem, attrs) },
                        post: function(scope, elem) {
                            if( typeof main != "undefined" ) main(elem);
                            if( restrict == "A" ) elem.removeAttr(_.kebabCase(name))
                        }
                    }
                }
            }]);
        }
        else{

            self.angular_module.directive(name, [function() {
                return {
                    restrict: restrict, scope: false, priority:1000-priority, transclude:true,
                    template: link, replace: true,
                    link: {
                        post: function(scope, elem) {
                            if( typeof main != "undefined" ) main(elem);
                        }
                    }
                }
            }]);
        }

    };


    /* Contructor. */

    /**
     *
     */
    self.__construct =  function() {

        if( !window.angular ){

            $(document)
                .ready(function(){ self.run( $('body') ) })
                .on('DOMNodeUpdated', function(e, $node, caller){
                    if( caller != "dom-compiler" )
                        self.run( $node )
                });
        }
        else{

            self.angular_module = angular.module('dom-compiler', []);

            self.angular_module.directive('transclude', [function () {
                return {
                    terminal: true, restrict: 'EA', link: function ($scope, $element, $attr, ctrl, transclude) {

                        if (!transclude) return;

                        transclude(function (clone) {

                            if (clone.length){

                                $element.replaceWith(clone);
                                clone.removeClass('ng-scope');
                            }
                            else
                                $element.remove();
                        });
                    }
                };
            }]);
        }
    };

    self.__construct();
};

var dom = dom || {};
dom.compiler = new DOMCompiler();