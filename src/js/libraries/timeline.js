/**
 * Animate
 *
 * Copyright (c) 2016 - Metabolism
 * Author:
 *   - Jé©rome Barbato <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 1.0
 *
 * Requires:
 *   - jQuery
 *
 **/

/**
 *
 */
var UITimeline = function(){

    var self = this;

    self.animations = {};


    /* Contructor. */

    /**
     *
     */
    self.__construct =  function(){

        $(document).on('boot', function(){

            self._setupAnimations();
            self._resize();

            $(window).resize(self._resize).scroll( self._scroll );

        }).on('loaded', function(){

            self._resize();
            self._scroll();
        });
    };

    /* Public */

    self.context = {
        hold      : false
    };


    self.scroll_infos = false;
    self.animations   = {};
    self.timelines    = [];


    /* Private. */

    self._resize = function(){

        self.context.win_height = $(window).height();
        self.context.doc_height = $(document).height();
    };


    /* Setup animations */
    self._setupAnimations = function(){

        var $timelines = $('.ui-timeline');

        if( $timelines.length == 0)
            return;

        $timelines.initialize(function(){

            var $timeline = $(this);
            var timeline  = self.animations[$timeline.data('timeline')];
            var tl        = new TimelineLite();

            tl.add("stagger");

            for( var i=0; i < timeline.length; i++ ){

                var keypoint = timeline[i];

                keypoint.animation.ease  = keypoint.ease;
                keypoint.animation.delay = keypoint.delay;

                if( keypoint.direction == "to" )
                    tl.add( TweenLite.to($timeline.find(keypoint.target), keypoint.duration, keypoint.animation) );
                else
                    tl.add( TweenLite.from($timeline.find(keypoint.target), keypoint.duration, keypoint.animation) );
            }

            if( $timeline.hasDataAttr('time_scale') )
                tl.timeScale($timeline.data('time_scale'));

            tl.pause();
            tl.seek(0.01);

            self.timelines.push({tl:tl, start_at:$timeline.data('start_at'), end_at:$timeline.data('end_at'), played:false, follow_scroll:$timeline.hasDataAttr('end_at')});
        });
    };


    self._scroll = function(){

        if( self.context.hold ) return;

        var scroll = $(window).scrollTop()/(self.context.doc_height-self.context.win_height);

        if( self.scroll_infos )
            console.log('scroll : '+scroll);

        $.each(self.timelines, function(i, timeline){

            if( !timeline.follow_scroll ){

                if( scroll >= timeline.start_at ){

                    if( !timeline.played ){

                        timeline.tl.play();
                        timeline.played = true;
                    }
                }
                else{

                    if( timeline.played ){

                        timeline.tl.reverse();
                        timeline.played = false;
                    }
                }
            }
            else{

                if( scroll >= timeline.start_at && scroll <= timeline.end_at ){

                    var position = Math.min(1, Math.max(0, (scroll-timeline.start_at)/(timeline.end_at-timeline.start_at)));
                    timeline.tl.progress(position);
                }
                else{
                    
                    timeline.tl.progress( scroll>timeline.start_at?1:0);
                }
            }
        });
    };


    if( typeof DOMCompiler !== "undefined" ){

        dom.compiler.register('attribute', 'timeline', function(elem, attrs) {

            elem.addClass('ui-timeline');

            elem.attr('data-timeline', attrs.timeline);
            elem.attr('data-start_at', attrs.startAt?attrs.startAt:0);

            if( attrs.endAt )
                elem.attr('data-end_at', attrs.endAt);

            if( attrs.timeScale )
                elem.attr('data-time_scale', attrs.timeScale);
        });
    }


    self.__construct();
};

var ui = ui || {};
ui.timeline = new UITimeline();