/**
 * Mail
 *
 * Copyright (c) 2014 - Metabolism
 * Author:
 *   - Jérome Barbato <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 1.0
 *
 * Requires:
 *   - jQuery
 *
 **/

var BEM = function(){

    var that   = this;

    that.debug = false;

    that._configure = function(type, elem, block_class_name, element_class_name){

        var single_binding = false;

        if( typeof element_class_name != 'undefined' && element_class_name.length ) {

            if( element_class_name.substring(0,1) == ':'){

                single_binding = true;
                element_class_name = element_class_name.substring(1);
            }

            element_class_name = '__'+element_class_name;
        }
        else
            element_class_name = '';

        elem.data(':bem', single_binding ? block_class_name : block_class_name+element_class_name);
        elem.data('bem', block_class_name+element_class_name);

        elem.addClass(block_class_name+element_class_name);

        if( that.debug )
            elem.attr('is', type);
    };



    that.addModifier = function(elem, attrs){

        attrs.mod.split(' ').forEach(function(mod){

            if( mod.length && mod != " ") {
                
                if (typeof elem.data('bem') != "undefined")
                    elem.addClass(elem.data('bem') + '--' + mod);
                else
                    elem.addClass(mod);
            }
        });
    };



    that.manageBlock = function(elem, attrs){

        that._configure('block', elem, attrs.block||attrs.component);
    };



    that.manageElements = function(elem, attrs){

        var $element = elem.parents('[element]');
        var $block   = elem.parents('[block]');


        if( !$element.length || $element.parents('[block]').data(':bem') != $block.data(':bem'))
            $element = $block;

        if( $element.length )
            that._configure('element', elem, $element.data(':bem'), attrs.element);
    };



    if( typeof DOMCompiler !== "undefined" ){

        dom.compiler.register('attribute', 'block', function (elem, attrs) {

            that.manageBlock(elem, attrs);
        });

        dom.compiler.register('attribute', 'component', function (elem, attrs) {

            elem.attr('block', attrs.component);
            that.manageBlock(elem, attrs);
        });

        dom.compiler.register('attribute', 'element', function (elem, attrs) {

            that.manageElements(elem, attrs);
        });

        dom.compiler.register('attribute', 'mod', function (elem, attrs) {

            that.addModifier(elem, attrs);
        });
    }
};

var dom = dom || {};
dom.bem = new BEM();