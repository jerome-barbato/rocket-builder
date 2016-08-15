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

    var that = this;

    that.dom_attributes         = [];
    that.dom_attributes_filters = [];
    that.dom_elements           = [];


    that.attr = function(elem, attr, value){

        if( window.precompile )
            elem.attr('data-'+attr, value);
        else
            elem.data(attr, value);
    };


    that._getAttributes = function(element){

        var attributes = {};

        for(var i=0; i<element.attributes.length; i++){

            var value = element.attributes[i].value;

            if( window.precompile )
                value = value.replace(/\{\{ /g, '{{').replace(/ \}\}/g, '}}').replace(/ \? /g, '?').replace(/ : /g, ':').replace(/ \| /g, '|').replace(/ ~ /g, '~');

            attributes[_.camelCase(element.attributes[i].name)] = value;
        }

        return attributes;
    };



    that._compileAttributes = function($dom){

        that.dom_attributes.forEach(function(dom_attribute){

            var compiler = _.camelCase(dom_attribute);

            if( $dom.is('['+dom_attribute+']') )
                that[compiler]($dom, that._getAttributes($dom[0]) );

            $dom.find('['+dom_attribute+']').each(function(){

                that[compiler]( $(this), that._getAttributes(this) );
            });
        });
    };



    that._compileAttributesFilters = function($dom){

        that.dom_attributes_filters.forEach(function(dom_attributes_filter){

            var compiler = _.camelCase(dom_attributes_filter);

            $dom.find('['+dom_attributes_filter+']').each(function(){

                that[compiler]( $(this), that._getAttributes(this) );
            });
        });
    };



    that._compileElement = function(dom, dom_element){

        var compiler = _.camelCase(dom_element);

        var $template = $(that[compiler]($(dom), that._getAttributes(dom)));
        var html      = $(dom).html();

        $template.find('transclude').replaceWith(html);

        for(var i=0; i<dom.attributes.length; i++){

            if( dom.attributes[i].name != 'class' )
                $template.attr(dom.attributes[i].name, dom.attributes[i].value);
            else
                $template.addClass(dom.attributes[i].value);
        }

        that._compileElements($template);

        $(dom).replaceWith($template);
    };


    that._compileElements = function($dom){

        that.dom_elements.forEach(function(dom_element){

            if( $dom.is(dom_element) )
                that._compileElement($dom[0], dom_element);

            $dom.find(dom_element).each(function(){
                that._compileElement(this, dom_element)
            });
        });
    };



    that._cleanAttributes = function($dom){

        that.dom_attributes.forEach(function (dom_attribute) {

            if( $dom.is('[' + dom_attribute + ']') )
                $dom.removeAttr(dom_attribute);

            $dom.find('[' + dom_attribute + ']').each(function () {

                $(this).removeAttr(dom_attribute);
            });
        });
    };



    that.run = function( $dom ){

        var raw_init = $dom.html();

        if( window._DEBUG )
            console.time('dom compilation');

        $dom = $dom.not('template');

        that._compileElements($dom);
        that._compileAttributes($dom);
        that._compileAttributesFilters($dom);

        that._cleanAttributes($dom);

        if( raw_init != $dom.html() ){
            setTimeout(function(){ $(document).trigger('DOMNodeUpdated', [$dom, 'dom-compiler']) });
        }

        if( window._DEBUG ){

            console.timeEnd('dom compilation');
            console.info('dom element count : '+($dom.find('*').length+$dom.length));
        }
    };



    that.register = function(type, attribute, link, main){

        var name = _.camelCase(attribute);

        switch (type){

            case 'attribute':

                that.dom_attributes.push(attribute);
                that._addAngularDirective('A', name, link, main, that.dom_attributes.length);
                break;

            case 'filter':

                that.dom_attributes_filters.push(attribute);
                that._addAngularDirective('F', name, link, main, that.dom_attributes_filters.length);
                break;

            case 'element':

                that.dom_elements.push(attribute);
                that._addAngularDirective('E', name, link, main, that.dom_elements.length);
                break;
        }

        DOMCompiler.prototype[name] = link;
    };



    that._addAngularDirective = function(restrict, name, link, main, priority){

        if( !window.angular ) return;

        if( restrict == "A" || restrict == "F" ){

            that.angular_module.directive(name, [function() {
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

            that.angular_module.directive(name, [function() {
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
    that.__construct =  function() {

        if( !window.angular ){

            $(document)
                .ready(function(){ that.run( $('body') ) })
                .on('DOMNodeUpdated', function(e, $node, caller){
                    if( caller != "dom-compiler" )
                        that.run( $node )
                });
        }
        else{

            that.angular_module = angular.module('dom-compiler', []);

            that.angular_module.directive('transclude', [function () {
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

    that.__construct();
};

var dom = dom || {};
dom.compiler = new DOMCompiler();