/**
 * Angulight
 *
 * Copyright (c) 2016 - Metabolism
 * Author:
 *   - Jérome Barbato <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 1.1
 *
 * Requires:
 *   - jQuery
 *
 **/

(function ($) {

    var Angulight = function () {

        var self = this;

        self.context = {
            controllers: {},
            instances  : {},
            templates  : {}
        };

        self.controller = function (id, callback) { self._register('controller', id, callback) };

        self.template = function (id) {

            return (id in self.context.templates) ? self.context.templates[id] : '';
        };

        self.camelCase = function (str) {
            return str
                .replace(/\s(.)/g, function ($1) { return $1.toUpperCase(); })
                .replace(/\s/g, '')
                .replace(/^(.)/, function ($1) { return $1.toLowerCase(); });
        };


        self._register = function (type, id, callback) {

            id = self.camelCase(id);

            if (typeof self.context[type + 's'][id] != "undefined") {
                console.error('Angulight: ' + type + ' ' + id + ' allready exist');
            } else {
                self.context[type + 's'][id] = callback;
            }

            $('[data-' + type + '="' + id + '"], [data-' + type + '^="' + id + '("]').each(function () {

                self._run(type, $(this));
            });
        };


        self._run = function (type, $element) {

            if (typeof $element == "undefined" || !$element || !$element.length) {
                return false;
            }

            var data   = $element.data(type).split('(');
            var name = self.camelCase(data[0]);
            var params = [$element];

            if (data.length == 2) {
                var raw_params = data[1].replace(')', '').replace(", '", ",'").replace("' ,", "',").split(',');

                for (var i = 0; i < raw_params.length; i++) {
                    if (raw_params[i].substr(0, 1) == '"' || raw_params[i].substr(0, 1) == "'") {
                        raw_params[i] = raw_params[i].replace(/"/g, '').replace(/'/g, '');
                    } else if (raw_params[i] == "false") {
                        raw_params[i] = false;
                    } else if (raw_params[i] == "true") {
                        raw_params[i] = true;
                    } else {
                        raw_params[i] = parseFloat(raw_params[i]);
                    }
                }

                params = params.concat(raw_params);
            }

            if (name in self.context[type + 's']) {
                if (app && app.debug > 2) {
                    console.time('angulight:run');
                }

                var fct      = self.context[type + 's'][name];
                var instance = self._guid();

                $element.data('angulight-instance', instance);
                self.context.instances[instance] = new (Function.prototype.bind.apply(fct, [null].concat(params)));

                if (app && app.debug > 2) {
                    console.log(name, params);
                    console.timeEnd('angulight:run')
                }
            }
        };


        self._guid = guid || function () {
                var s4 = function () {
                    return Math.floor((1 + Math.random()) * 0x10000)
                               .toString(16)
                               .substring(1);
                };
                return s4() + s4();
            };


        self.__construct = function () {
            $('script[type="text/template"]').each(function () {
                self.context.templates[$(this).attr('id')] = $(this).html();
            });


            $('[data-controller]').initialize(function () {
                self._run('controller', $(this));
            });


            $('[data-if]').initialize(function () {
                var condition = $(this).data('if');
                if (condition == "false" || condition == "0" || condition == "" || !condition) {
                    $(this).remove();
                }

                $(this).removeAttr('data-if');
            });


            $('[data-remove_on]').initialize(function () {
                var removeOn = $(this).data('remove_on');

                if ((removeOn == "mobile" && browser.mobile) || (removeOn == "desktop" && browser.desktop) || (removeOn == "tablet" && browser.tablet) || (removeOn == "phone" && browser.phone)) {
                    $(this).remove();
                }
            });


            $('[data-if-not]').initialize(function () {

                var condition = $(this).data('if-not');
                if (condition == "true" || condition == "1" || condition) {
                    $(this).remove();
                }

                $(this).removeAttr('data-if-not');
            });
        };


        if (typeof dom !== "undefined") {
            dom.compiler.register('attribute', 'controller', function (elem, attrs) {
                elem.attr('data-controller', attrs.controller);
            });

            dom.compiler.register('attribute', 'remove-on', function (elem, attrs) {
                elem.attr('data-remove_on', attrs.removeOn);
            });

            // Compatibility
            dom.compiler.register('attribute', 'directive', function (elem, attrs) {
                console.log('Angulight directive has been removed please une controller instead');
                elem.attr('data-controller', attrs.directive);
            });


            dom.compiler.register('attribute', 'if', function (elem, attrs) {
                if ('if' in attrs) {
                    elem.attr('data-if', attrs['if']);
                }
            });

            dom.compiler.register('attribute', 'if-not', function (elem, attrs) {
                if ('ifNot' in attrs) {
                    elem.attr('data-if-not', attrs.ifNot);
                }
            });
        }

        self.__construct();
    };

    if (typeof app != 'undefined') {
        app.services = app.services || {};
    }

    angulight = new Angulight();

})(jQuery);

