/**
 * Slider
 *
 * Copyright (c) 2017 - Metabolism
 * Author:
 *   - Jérome Barbato <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 3.0
 *
 * Changelog
 * v2.0
 * css animations only, removed IE9 compat
 * v2.1
 * renamed ui-slider to meta-slider
 * v3.0
 * renamed meta-slider to swiper-container
 *
 * Requires:
 *   - jQuery
 *
 **/

(function ($) {

	var Slider = function (config)
	{
		var self = this;

		/* Contructor. */

		/**
		 *
		 */
		self.__construct = function (config)
		{
			self.config = $.extend(self.config, config);

			if (self.config.display)
			{
				try
				{
					self.config.display = JSON.parse('{"' + self.config.display.replace(/:/g, '":"').replace(/,/g, '","') + '"}')
				}
				catch (e) {}
			}

			if (app && app.debug > 2)
				console.log('slider', self.config);

			self._setupContext();
			self._setupEvents();
		};


		/* Public */

		self.config = {
			$element      : false,
			autoplay      : false,
			hold          : true,
			animation     : 'horizontal',
			start_slide   : 0,
			swipe_tablet  : true,
			swipe_mobile  : true,
			swipe_desktop : true,
			preload       : true,
			loop          : true,
			sync          : false,
			height        : false,
			load          : 1.9,
			use_transition: Modernizr && Modernizr.csstransitions,
			display       : false
		};


		self.context = {
			indices      : {current: -1},
			is_animating : false,
			is_visible   : false,
			timer        : false,
			count        : false,
			loop         : 0,
			paused       : false,
			window_height: 0,
			$window      : false,
			animationEnd : 'animationend oanimationend webkitAnimationEnd MSAnimationEnd'
		};


		self.classnames = {
			slider    : 'swiper-container',
			slides    : 'swiper-wrapper',
			slide     : 'swiper-slide',
			pagination: 'swiper-pagination',
			arrows    : 'swiper-buttons',
			arrow     : 'swiper-button',
			preload   : 'swiper-preload',
			scroller  : 'swiper-scroller'
		};


		/* Public */

		self.goto   = function (id, animate, callback){ self._show(id, animate, callback) };
		self.pause  = function () { self.context.paused = true };
		self.resume = function () { self.context.paused = false };


		/* Private. */


		self._addMod    = function ($element, element, mod) { if ($element) $element.addClass(self.classnames[element] + '--' + mod) };
		self._removeMod = function ($element, element, mod) { if ($element) $element.removeClass(self.classnames[element] + '--' + mod) };
		self._alterMod  = function ($element, element, mod) { if ($element) $element.alterClass(self.classnames[element] + '--' + (mod ? mod : '') + '*') };


		/**
		 *
		 */
		self._setupContext = function ()
		{
			if (typeof self.config.$element.attr('id') === 'undefined')
				self.config.$element.attr('id', guid('slider'));

			self.context.$slides_container     = self.config.$element.findClosest('.' + self.classnames.slides, '.' + self.classnames.slider);
			self.context.$slides               = self.context.$slides_container.findClosest('.' + self.classnames.slide, '.' + self.classnames.slider);
			self.context.$pagination_container = self.config.$element.findClosest('.' + self.classnames.pagination, '.' + self.classnames.slider);
			self.context.$pagination           = self.context.$pagination_container.find('> a');
			self.context.$arrows               = self.config.$element.findClosest('.' + self.classnames.arrow + '-prev, .' + self.classnames.arrow + '-next');
			self.context.slide_count           = self.context.$slides.length;
			self.context.offset                = self.config.$element.offset().top;
			self.context.$window               = $(window);
			self.context.window_height         = self.context.$window.height();

			if (!self.context.slide_count)
				return false;

			if( !self._packSlides() )
				return;

			self.context.$slides_container
				.attr('data-transition', self.config.animation)
				.wrap('<div class="' + self.classnames.scroller + '"/>');

			self.context.$scroller = self.config.$element.findClosest('.' + self.classnames.scroller );

			if (self.context.slide_count < 2)
				self.context.$arrows.hide();


			if (self.config.preload)
				self.config.$element.append('<div class="' + self.classnames.preload + '"/>', false);

			self._sync();

			if (self.config.height && !isNaN(self.config.height))
				self.context.$scroller.height(self.config.height);

			self._initArrows();
			self._initPagination();
			self._load();
		};


		self._load = function ()
		{
			self._preload();

			var _load = function ()
			{
				self._show(Math.min(self.context.slide_count, self.config.start_slide), false);
				setTimeout(function () { self.config.$element.addClass('swiper-loaded') });
			};

			if (document.readyState === "complete")
				_load();
			else
				$(window).on('load', _load);
		};


		self._packSlides = function ()
		{
			var pack = false;
			var destroy = false;
			var devices = ['desktop','mobile','tablet','phone'];

			for( var i in devices)
			{
				var device = devices[i];

				if (device in self.config && device in browser && browser[device] && !pack)
				{
					if( self.config[device] === false )
					{
						destroy = true;
						return false;
					}
					else
					{
						pack = parseInt(self.config[device]);
					}
				}
			}

			if( destroy )
            {
	            self.destroy();
                return false;
            }
			else
            {
	            if( !pack && 'all' in self.config )
		            pack = parseInt(self.config['all']);

	            if( pack )
	            {
		            for (var j = 0; j < self.context.$slides.length; j += pack)
		            {
			            self.context.$slides.slice(j, j + pack)
				            .wrapAll("<div class='" + self.classnames.slide + "'></div>")
				            .children()
				            .unwrap();
		            }
	            }

	            self.context.$slides     = self.context.$slides_container.findClosest('.' + self.classnames.slide, '.' + self.classnames.slider);
	            self.context.slide_count = self.context.$slides.length;

	            return true;
            }
		};


		self.destroy = function (){

			self.context.$slides.contents().unwrap();
			self.context.$pagination_container.remove();
			self.context.$arrows.remove();
			self.context.$slides_container.contents().unwrap();
			self.context.$slides_container.unwrap();
			self.config.$element.contents().unwrap();
		};


		self._sync = function ()
		{
			if (self.config.sync)
			{
				$('#' + self.config.sync).on('slider.updated', function (e, index)
				{
					if (index !== self.context.indices.current)
						self._show(index, true);
				});
			}
		};


		self._autoplay = function ()
		{
			if (!self.config.autoplay || self.config.autoplay < 500 || self.context.slide_count < 2)
				return;

			clearTimeout(self.context.timer);

			self.context.timer = setTimeout(function ()
			{
				if (self.context.is_visible)
					self._show(self.context.indices.current + 1, true);

			}, self.config.autoplay);

		};


		self._setupEvents = function ()
		{
			if (self.config.autoplay && self.config.hold)
				self.config.$element.hover(function () { self.pause() }, function () { self.resume() });

			if ($.isFunction($.fn.swipe) && self.context.slide_count > 1 &&
				( (self.config.swipe_desktop && browser.desktop)
					|| (self.config.swipe_tablet && browser.tablet)
					|| (self.config.swipe_mobile && browser.mobile && !browser.tablet) )
			)
			{
				self.config.$element.swipe({
					swipeLeft : function () { self._show(self.context.indices.current + 1, true) },
					swipeRight: function () { self._show(self.context.indices.current - 1, true) }
				});
			}

			self.context.$window
				.resize(self._computeOffset)
				.scroll(self._checkVisibility);

			$(window).on('load', self._computeOffset);


			self.config.$element.on('slider.update', function (e, index, animate)
			{
				if (typeof animate === 'undefined')
					animate = true;

				if (index !== self.context.indices.current)
					self._show(index, animate);
			});

			self.config.$element.on('slider.resize', self._resize);

			self.config.$element.on('slider.autoplay', function (e, state) {

				if (!self.config.autoplay)
					return;

				if (state)
					self.resume();
				else
					self.pause();
			});
		};


		self._computeOffset = function ()
		{
			self.context.offset        = self.config.$element.offset().top;
			self.context.window_height = self.context.$window.height();

			self._resize();
			self._checkVisibility();
		};


		self._resize = function(){

			if ( self.config.height === "auto" && self.context.$current_slide && self.context.$current_slide.length )
				self.context.$scroller.height( self.context.$current_slide.outerHeight() );
		};


		self._checkVisibility = function ()
		{
			var scrollTop    = self.context.$window.scrollTop();
			var targetScroll = scrollTop + self.context.window_height * 0.8;
			var is_visible   = self.context.offset <= targetScroll;

			if (is_visible && !self.context.is_visible)
				self._autoplay();

			self.context.is_visible = is_visible;

			self._preload();
			self._autoplay();
		};


		self._computeIndexes = function (target)
		{
			var direction = self.context.indices.current > target ? 'prev' : 'next';
			var next      = direction === 'prev' ? target - 1 : target + 1;
			var current   = self.context.indices.current;

			if (self.config.loop)
			{
				if (target >= self.context.slide_count)
				{
					target    = 0;
					direction = 'next';

				}
				else if (target < 0)
				{
					target    = self.context.slide_count - 1;
					direction = 'prev';
				}

				next = direction === 'prev' ? target - 1 : target + 1;

				if (next >= self.context.slide_count)
					next = 0;
				else if (next < 0)
					next = self.context.slide_count - 1;
			}
			else
			{
				if (target >= self.context.slide_count || target < 0)
					return false;
			}

			self.context.$slides_container.attr('data-direction', (direction === 'next' ? 'forward' : 'backward'));
			self.config.$element.attr('data-index', (parseInt(target) + 1));

			self.context.direction        = direction;
			self.context.indices.current  = target;
			self.context.indices.next     = next;
			self.context.indices.previous = current;

			return true;
		};


		self._show = function (index, animate, callback)
		{
			clearTimeout(self.context.timer);

			if (self.context.is_animating || self.context.indices.current === index) return;

			if (!self._computeIndexes(index))
				return false;

			self.context.is_animating = true;

			self.config.$element.trigger('slider.updated', [index,animate, self.context.indices.current]);

			self.context.$current_slide = self.context.$slides.eq(self.context.indices.current);

			if (self.context.indices.next >= 0 && self.context.indices.next < self.context.slide_count && self.context.slide_count > 1)
				self.context.$next_slide = self.context.$slides.eq(self.context.indices.next);
			else
				self.context.$next_slide = false;

			if (self.context.indices.previous >= 0 && self.context.indices.previous < self.context.slide_count && self.context.slide_count > 1)
				self.context.$previous_slide = self.context.$slides.eq(self.context.indices.previous);
			else
				self.context.$previous_slide = false;

			self._removeMod(self.context.$arrows, 'button', 'disabled');

			if (self.context.indices.current >= self.context.slide_count - 1 && !self.config.loop)
				self._addMod(self.context.$arrows.filter('.' + self.classnames.arrow + '-next'), 'button', 'disabled');

			if (self.context.indices.current === 0 && !self.config.loop)
				self._addMod(self.context.$arrows.filter('.' + self.classnames.arrow + '-prev'), 'button', 'disabled');

			self._updateSlides(animate, callback);
			self._updatePagination();

			self.context.loop++;
		};


		self._updateSlides = function (animate, callback)
		{
			self._alterMod(self.context.$slides, 'slide');

			if (animate)
				self._addMod(self.context.$slides_container, 'slides', 'animating');

			if (self.context.$previous_slide)
				self._addMod(self.context.$previous_slide, 'slide', 'previous');

			self._addMod(self.context.$current_slide, 'slide', 'current');

			if (self.context.$next_slide)
				self._addMod(self.context.$next_slide, 'slide', 'next');

			var $video = self.context.$current_slide.find('video');
			if( $video.length )
				$video.get(0).play();

			self._animate(animate, function ()
			{
				if ($.fn.fit)
					self.context.$current_slide.find('[data-object_fit]').fit(true);

				if (animate)
					self._removeMod(self.context.$slides_container, 'slides', 'animating');

				self.context.is_animating = false;

				if(self.context.$previous_slide )
				{
					var $video = self.context.$previous_slide.find('video');
					if( $video.length )
						$video.get(0).pause();
				}

				self._preload();
				self._autoplay();

				self.config.$element.trigger('slider.animated');

				if( callback )
					callback();
			});
		};


		self._animate = function (animate, callback)
		{
			self._resize();

			if (animate)
			{
				if (!self.context.loop)
					callback();

				var $animatedSlides = self.context.$slides.filter(':visible').not(function ()
				{
					var animation = $(this).css('animation-name');
					return !animation || animation === "none";
				});

				var i = 0;

				$animatedSlides.on(self.context.animationEnd, function (e)
				{
					if ($(e.target).is('.' + self.classnames.slide))
					{
						i++;
						$(this).off(self.context.animationEnd);
					}

					if (i === $animatedSlides.length)
						callback();
				});

				if (!self.config.use_transition || !$animatedSlides.length)
					callback();
			}
			else
			{
				callback();
			}
		};


		self._updatePagination = function ()
		{
			self.context.$pagination.removeClass('is-active');

			if (self.context.indices.current >= 0)
				self.context.$pagination.eq(self.context.indices.current).addClass('is-active');
		};


		self._initArrows = function ()
		{
			self.context.$arrows.on('click keypress', function (e)
			{
				if (e.which === 13 || e.type === 'click') {
					e.preventDefault();

					var inc = $(this).hasClass(self.classnames.arrow + '-prev') ? -1 : 1;

					self._show(self.context.indices.current + inc, true);
				}
			});
		};


		self._preload = function ()
		{
			var scrollTop    = self.context.$window.scrollTop();
			var targetScroll = scrollTop + self.context.window_height;

			if (self.config.preload && self.context.offset <= targetScroll * self.config.load)
			{
				self._loadOnDemand(self.context.$current_slide);

				if (self.context.$next_slide && self.context.offset <= targetScroll * self.config.load)
				{
					self._loadOnDemand(self.context.$next_slide);

					if (self.config.preload > 1)
					{
						var $next = self.context.$next_slide.next();

						if ($next.length)
							self._loadOnDemand($next);
					}
				}

				if (self.config.loop && self.context.$previous_slide && self.context.offset <= targetScroll * self.config.load)
					self._loadOnDemand(self.context.$previous_slide);
			}
		};


		self._loadOnDemand = function ($slide)
		{
			if (!$slide || !$slide.length)
				return false;

			$slide.find('[data-src]').each(function ()
			{
				var $element = $(this);

				//force load to memory
				if (Modernizr && Modernizr.csstransforms3d && !$element.is('video'))
				{
					self.config.$element.find('.' + self.classnames.preload)
						.append('<img src="' + $element.data('src') + '"/>', false);
				}

				if ($element.is('img'))
					$element.attr('src', $element.data('src'));
				else if( $element.is('video') )
				{
					$element.html('<source src="' + $element.data('src') + '" type="video/mp4"><source src="' + $element.data('src').replace('.mp4', '.webm') + '" type="video/webm">');
					$element.attr('autoplay');
				}
				else
					$element.css('backgroundImage', "url('" + $element.data('src') + "')");

				$element.removeAttr('data-src');
			});

			return true;
		};


		self._initPagination = function ()
		{
			var $pagination = self.config.$element.findClosest('.' + self.classnames.pagination, '.' + self.classnames.slider);

			if (!self.context.$pagination.length && self.context.slide_count > 1)
			{
				var a = '<a></a>';

				$pagination.append(a.repeat(self.context.slide_count), false);

				self.context.$pagination = $pagination.find('> a');
			}

			self.context.$pagination.click(function (e)
			{
				e.preventDefault();
				self._show($(this).index(), true);
			});

			self._updatePagination();
		};


		self.__construct(config);
	};


	/*
	 Sliders Mananger
	 */
	var Sliders = function ()
	{
		var self = this;

		self.add = function ($slider)
		{
			var context = {};

			if ($(this).data('context'))
			{
				try
				{
					context = $slider.data('context') ? JSON.parse('{' + $slider.data('context').replace(/'/g, '"') + '}') : {};
				}
				catch (e) {}
			}
			else
			{
				context = $slider.data();
			}

			context.$element = $slider;

			new Slider(context);
		};


		self.__construct = function ()
		{
			$('.swiper-container').initialize(function ()
			{
				self.add($(this));
			});
		};

		self.__construct();
	};

	new Sliders();

	rocket        = typeof rocket === 'undefined' ? {} : rocket;
	rocket.slider = Slider;

})(jQuery);
