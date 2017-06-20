/**
 * Mail
 *
 * Copyright (c) 2017 - Metabolism
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

(function ($) {

    var BEM = function () {

        var self = this;

        self.debug = false;

        self._configure = function (type, elem, block_class_name, element_class_name) {

            var single_binding = false;
            var double_binding = false;

            if (typeof element_class_name != 'undefined' && element_class_name.length) {

                if (element_class_name.substring(0, 2) == '::') {

                    double_binding     = true;
                    element_class_name = element_class_name.substring(2);
                }
                else if (element_class_name.substring(0, 1) == ':') {

                    single_binding     = true;
                    element_class_name = element_class_name.substring(1);
                }

                element_class_name = '__' + element_class_name;
            }
            else {
                element_class_name = '';
            }

            elem.data(':bem', single_binding ? block_class_name : block_class_name + element_class_name);
            elem.data('bem', block_class_name + element_class_name);

            if (elem.data('bem').split('__').length > 3) {
                console.warn(elem.data('bem') + ' : BEM depth is important, please use single/double binding');
            }

            if (double_binding) {

                var bem = block_class_name.split('__');

                if (bem.length > 1) {
                    bem.pop();
                }

                elem.addClass(bem.join('__') + element_class_name);
            }
            else {
                elem.addClass(block_class_name + element_class_name);
            }

            if (self.debug) {
                elem.attr('is', type);
            }
        };


        self.addModifier = function (elem, attrs) {

            if (window.precompile) {
                attrs.mod = attrs.mod.replace(/\s+(?=[^\{\}]*\})/g, '[__]');
            }

            attrs.mod.split(' ').forEach(function (mod) {

                if (mod.length) {

                    if (window.precompile) {
                        mod = mod.replace(/\[__\]/g, ' ');
                    }

                    if (typeof elem.data('bem') != "undefined") {
                        elem.addClass(elem.data('bem') + '--' + mod);
                    } else {
                        elem.addClass(mod);
                    }
                }
            });
        };


        self.removeModifier = function (elem, attrs) {

            if (window.precompile) {
                attrs.mod = attrs.mod.replace(/\s+(?=[^\{\}]*\})/g, '[__]');
            }

            attrs.mod.split(' ').forEach(function (mod) {

                if (window.precompile) {
                    mod = mod.replace(/\[__\]/g, ' ');
                }

                if (mod.length && mod != " ") {

                    if (typeof elem.data('bem') != "undefined") {
                        elem.removeClass(elem.data('bem') + '--' + mod);
                    } else {
                        elem.removeClass(mod);
                    }
                }
            });
        };


        self.manageBlock = function (elem, attrs) {

            self._configure('block', elem, attrs.block);
        };


        self.manageElements = function (elem, attrs) {

            var $element = elem.parents('[element]');
            var $block   = elem.parents('[block]');

            if (!$element.length || $element.parents('[block]').data(':bem') != $block.data(':bem')) {
                $element = $block;
            }

            if ($element.length) {
                self._configure('element', elem, $element.data(':bem'), attrs.element);
            }
        };


        dom.compiler.register('attribute', 'block', function(elem, attrs) {

            self.manageBlock(elem, attrs);
        });

        dom.compiler.register('attribute', 'element', function(elem, attrs) {

            self.manageElements(elem, attrs);
        });

        dom.compiler.register('attribute', 'mod', function(elem, attrs) {

            self.addModifier(elem, attrs);
        });
    };

    dom     = typeof dom == 'undefined' ? {} : dom;
    dom.bem = new BEM();

})(jQuery);
