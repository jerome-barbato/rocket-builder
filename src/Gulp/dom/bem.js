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

			if (typeof element_class_name !== 'undefined' && element_class_name.length)
				element_class_name = '__' + element_class_name;
			else
				element_class_name = '';

			elem.data(':bem', block_class_name);
			elem.data('bem', block_class_name + element_class_name);

			//add class before any other class
			var current_class = elem.attr('class');
			current_class = typeof current_class !== 'undefined' ? ' ' + current_class : '';

			elem.attr('class', block_class_name + element_class_name + current_class);

			if (self.debug)
				elem.attr('is', type);
		};


		self.addModifier = function (elem, attrs) {

			attrs.mod = attrs.mod.replace(/\s+(?=[^\{\}]*\})/g, '[__]')

			attrs.mod.split(' ').forEach(function (mod) {

				if (mod.length) {

					mod = mod.replace(/\[__\]/g, ' ');

					if (typeof elem.data('bem') !== "undefined")
					{
						elem.removeClass(elem.data('bem'));

						var current_class = elem.attr('class');
						current_class = typeof current_class !== 'undefined' ? ' ' + current_class : '';

						elem.attr('class', elem.data('bem') + ' ' + elem.data('bem') + '--' + mod + ' ' + current_class );
					}
					else
						elem.addClass(mod);
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
