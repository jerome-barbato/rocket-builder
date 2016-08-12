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
    that.debug                  = false;


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



    that._compileElements = function($dom){

        that.dom_elements.forEach(function(dom_element){

            $dom.find(dom_element).each(function(){

                var compiler = _.camelCase(dom_element);

                var $template = $(that[compiler]($(this), that._getAttributes(this)));
                var html      = $(this).html();

                $template.find('transclude').replaceWith(html);

                for(var i=0; i<this.attributes.length; i++){

                    if( this.attributes[i].name != 'class' )
                        $template.attr(this.attributes[i].name, this.attributes[i].value);
                    else
                        $template.addClass(this.attributes[i].value);
                }

                that._compileElements($template);

                $(this).replaceWith($template);
            });
        });
    };



    that._cleanAttributes = function($dom){

        that.dom_attributes.forEach(function (dom_attribute) {

            $dom.find('[' + dom_attribute + ']').each(function () {

                $(this).removeAttr(dom_attribute);
            });
        });
    };



    that.run = function( $dom ){

        if( that.debug )
            console.time('dom compilation');

        $dom = $dom.not('template');

        that._compileElements($dom);
        that._compileAttributes($dom);
        that._compileAttributesFilters($dom);

        that._cleanAttributes($dom);

        $(document).trigger('dom-compiled');

        if( that.debug ){

            console.timeEnd('dom compilation');
            console.info('dom element count : '+$dom.find('*').length);
        }
    };



    that.register = function(type, attribute, link){

        var name = _.camelCase(attribute);

        switch (type){

            case 'attribute':

                that.dom_attributes.push(attribute);
                that._addAngularDirective('A', name, link, that.dom_attributes.length);
                break;

            case 'filter':

                that.dom_attributes_filters.push(attribute);
                that._addAngularDirective('F', name, link, that.dom_attributes_filters.length);
                break;

            case 'element':

                that.dom_elements.push(attribute);
                that._addAngularDirective('E', name, link, that.dom_elements.length);
                break;
        }

        DOMCompiler.prototype[name] = link;
    };



    that._addAngularDirective = function(restrict, name, link, priority){

        if( !window.angular ) return;

        if( restrict == "A" || restrict == "F" ){

            that.angular_module.directive(name, [function() {
                return {
                    restrict: "A", scope: false, priority:1000-priority,
                    link: {
                        pre: function(scope, elem, attrs) { link(elem, attrs) },
                        post: function(scope, elem) { if( restrict == "A" ) elem.removeAttr(_.kebabCase(name)) }
                    }
                }
            }]);
        }
        else{

            that.angular_module.directive(name, [function() {
                return {
                    restrict: restrict, scope: false, priority:1000-priority, transclude:true,
                    template: link, replace: true
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

            $(document).ready(function(){

                that.run( $('body') );
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