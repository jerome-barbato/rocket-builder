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

        var depth = elem.data('bem').split('__').length;

        if( depth > 3 )
            console.warn(elem.data('bem')+' : BEM depth is important, please use single binding');

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



    that.removeModifier = function(elem, attrs){

        attrs.mod.split(' ').forEach(function(mod){

            if( mod.length && mod != " ") {

                if (typeof elem.data('bem') != "undefined")
                    elem.removeClass(elem.data('bem') + '--' + mod);
                else
                    elem.removeClass(mod);
            }
        });
    };



    that.manageBlock = function(elem, attrs){

        that._configure('block', elem, attrs.block);
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

        dom.compiler.register('attribute', 'element', function (elem, attrs) {

            that.manageElements(elem, attrs);
        });

        dom.compiler.register('attribute', 'mod', function (elem, attrs) {

            that.addModifier(elem, attrs);
        });
    }


    if (window.jQuery) {

        window.jQuery.fn.addMod = function(mod) { that.addModifier(this, {mod:mod}) };
        window.jQuery.fn.removeMod = function(mod) { that.removeModifier(this, {mod:mod}) };
    }
};

var dom = dom || {};
dom.bem = new BEM();