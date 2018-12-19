//add SrcSet support ( mostly for IE9-10-11 )

(function ($) {

	if (window.Modernizr && !Modernizr.srcset) {

		var chooseSrc = function($element, srcsets){

			var window_width = $(window).width();
			var src = srcsets[0][0];
			var current_src = $element.attr('src');

			$.each(srcsets, function(i, srcset){

				if( window_width <= srcset[1] )
					src = srcset[0];
			});

			if( src != current_src ){

				$element.attr('src', src);

				if( $.fn.fit )
					$element.fit(true);
			}
		};

		$('[srcset]').initialize(function(){

			var $elem   = $(this);
			var srcsets = $elem.attr('srcset').replace(', ',',').replace(' ,',',').split(',');

			$.each(srcsets, function(i, srcset){

				srcset = srcset.split(' ');

				if( srcset.length > 1 )
				{
					srcsets[i] = srcset;
					srcsets[i][1] = parseInt( srcset[1].replace('w','') );
				}
			});

			chooseSrc($elem, srcsets);

			$(window).resize(function(){
				chooseSrc($elem, srcsets);
			});
		});
	}
})(jQuery);

