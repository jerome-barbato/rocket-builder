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

    self.camelCase = function(str) {

        return str
            .replace(/-/g, ' ')
            .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
            .replace(/\s/g, '')
            .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
    };

    self.kebabCase = function(str) {

        return str
            .replace(/([a-z][A-Z])/g, function(match) { return match.substr(0, 1) + '-' + match.substr(1, 1).toLowerCase() })
            .toLowerCase()
            .replace(/[^-a-z0-9]+/g, '-')
            .replace(/^-+/, '')
            .replace(/-$/, '');
    };

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
                value = value.replace(/\{\{ /g, '{{').replace(/ \}\}/g, '}}');

            attributes[self.camelCase(element.attributes[i].name)] = value.trim();
        }

        return attributes;
    };



    self._compileAttributes = function($dom){

        self.dom_attributes.forEach(function(dom_attribute){

            var compiler = 'A'+self.camelCase(dom_attribute);

            if( $dom.is('['+dom_attribute+']') )
                self[compiler]($dom, self._getAttributes($dom[0]) );

            $dom.find('['+dom_attribute+']').each(function(){

                self[compiler]( $(this), self._getAttributes(this) );
            });
        });
    };



    self._compileAttributesFilters = function($dom){

        self.dom_attributes_filters.forEach(function(dom_attributes_filter){

            var compiler = 'F'+self.camelCase(dom_attributes_filter);

            $dom.find('['+dom_attributes_filter+']').each(function(){

                self[compiler]( $(this), self._getAttributes(this) );
            });
        });
    };



    self._compileElement = function(dom, dom_element){

        var compiler = 'E'+self.camelCase(dom_element);

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

        self.dom_attributes.forEach(function(dom_attribute) {

            if( $dom.is('[' + dom_attribute + ']') )
                $dom.removeAttr(dom_attribute);

            $dom.find('[' + dom_attribute + ']').each(function() {

                $(this).removeAttr(dom_attribute);
            });
        });
    };



    self.run = function( $dom ){

        var raw_init = $dom.html();

        if( app.debug )
            console.time('dom compilation');

        $dom = $dom.not('template');

        self._compileElements($dom);
        self._compileAttributes($dom);
        self._compileAttributesFilters($dom);

        self._cleanAttributes($dom);

        if( raw_init != $dom.html() ){

            setTimeout(function(){

                $(document).trigger('DOMNodeUpdated', [$dom, 'dom-compiler']);
            });
        }

        if( app.debug ){

            console.timeEnd('dom compilation');
            console.info('dom element count : '+($dom.find('*').length+$dom.length));
        }
    };



    self.register = function(type, attribute, link, main){

        var name = self.camelCase(attribute);
        var element_type = '';

        switch (type){

            case 'attribute':

                self.dom_attributes.push(attribute);
                element_type = 'A';
                self._addAngularDirective(element_type, name, link, main, self.dom_attributes.length);
                break;

            case 'filter':

                self.dom_attributes_filters.push(attribute);
                element_type = 'F';
                self._addAngularDirective(element_type, name, link, main, self.dom_attributes_filters.length);
                break;

            case 'element':

                self.dom_elements.push(attribute);
                element_type = 'E';
                self._addAngularDirective(element_type, name, link, main, self.dom_elements.length);
                break;
        }

        DOMCompiler.prototype[element_type+name] = link;
    };



    self._addAngularDirective = function(restrict, name, link, main, priority){

        if( !window.angular ) return;

        if( restrict == "A" || restrict == "F" ){

            self.angular_module.directive(name, ['$timeout', function($timeout) {
                return {
                    restrict: "A", scope: false, priority:1000-priority,
                    link: {
                        pre: function(scope, elem, attrs) { link(elem, attrs) },
                        post: function(scope, elem) {
                            if( typeof main != "undefined" ) $timeout(function(){ main(elem) });
                            if( restrict == "A" ) elem.removeAttr(self.kebabCase(name))
                        }
                    }
                }
            }]);
        }
        else{

            self.angular_module.directive(name, ['$timeout', function($timeout) {
                return {
                    restrict: restrict, scope: true, priority:1000-priority, transclude:true,
                    template: link, replace: true,
                    link: {
                        post: function(scope, elem) {
                            if( typeof main != "undefined" ) $timeout(function(){ main(elem) });
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

            $(document).on('DOMNodeUpdated', function(e, $node, caller){
                if( caller != "dom-compiler" && caller != "initialize" )
                    self.run( $node )
            });
        }
        else{

            self.angular_module = window.angular.module('dom-compiler', []);

            self.angular_module.directive('transclude', [function() {
                return {
                    terminal: true, scope: true, restrict: 'EA', link: function($scope, $element, $attr, ctrl, transclude) {

                        if (!transclude) return;

                        transclude(function(clone) {

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

var app = app || {};

if(window.jQuery && typeof $.fn.initialize == "undefined")
    $.fn.initialize = $.fn.each;

var dom = dom || {};
dom.compiler = new DOMCompiler();