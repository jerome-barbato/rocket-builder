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

/*
 * Exemple :
 *
 *  "home":
 *  [
 *     {"target": "#item-1", "animation":{"opacity":0, "x": "-30px"}, "ease":"Cubic.easeInOut", "delay":0, "duration":0.4, "direction":"from" },
 *     {"target": "#item-2", "animation":{"opacity":0, "y": "-30px"}, "ease":"Cubic.easeInOut", "delay":0, "duration":0.4, "direction":"from" }
 *  ]
 */

(function ($) {

    var Timeline = function () {

        var self = this;

        /* Contructor. */

        /**
         *
         */
        self.__construct = function () {

            self._initialize();

            $(window)
                .resize(self._resize)
                .scroll(self._play);

            $(window).on('load', self._resize);
        };

        /* Public */

        self.context = {
            hold      : true,
            timelines : [],
            animations: {}
        };


        /* Private. */

        self._resize = function () {

            self.context.hold = false;

            self.context.win_height = $(window).height();
            self.context.doc_height = $(document).height();

            self._play();
        };


        self._initialize = function () {

            $('[data-timeline]').initialize(function () {

                var options = {
                    name      : $(this).data('timeline'),
                    time_scale: $(this).hasDataAttr('time_scale') ? $(this).data('time_scale') : false,
                    start_at  : $(this).hasDataAttr('start_at') ? $(this).data('start_at') : 0,
                    end_at    : $(this).hasDataAttr('end_at') ? $(this).data('end_at') : false,
                    debug     : $(this).hasDataAttr('debug') ? true : false
                };

                if (options.name in self.context.animations) {
                    self.set($(this), self.context.animations[options.name], options)
                }
            });
        };


        self._play = function () {

            if (self.context.hold) return;

            var screen_height = self.context.doc_height - self.context.win_height;
            var scroll = screen_height > 0 ? $(window)
                    .scrollTop() / (self.context.doc_height - self.context.win_height) : 0;

            $.each(self.context.timelines, function (i, timeline) {

                if (timeline.debug) {
                    console.log(timeline.name + ' scroll : ' + scroll);
                }

                if (!timeline.follow_scroll) {

                    if (scroll >= timeline.start_at) {

                        if (!timeline.played) {

                            timeline.tl.play();
                            timeline.playing = true;
                            timeline.played = true;
                        }
                    }
                    else {

                        if (timeline.played) {

                            timeline.tl.reverse();
                            timeline.played = false;
                        }
                    }
                }
                else {

                    if (scroll >= timeline.start_at && scroll <= timeline.end_at) {

                        var position = Math.min(1, Math.max(0, (scroll - timeline.start_at) / (timeline.end_at - timeline.start_at)));
                        timeline.tl.progress(position);
                    }
                    else {

                        timeline.tl.progress(scroll > timeline.start_at ? 1 : 0);
                    }
                }
            });
        };


        self._addDebugger = function ($element, timeline) {

            var $debugger = $('<div class="meta-timeline__debugger" title="Press spacebar to toggle play/pause"></div>');
            $element.append($debugger);

            $debugger.slider({
                range: 'min',
                min  : 0,
                max  : 1,
                step : .001,
                slide: function (event, ui) {
                    timeline.tl.progress(ui.value).pause();
                    timeline.playing = false;
                }
            });

            $debugger.on('keypress', function (e) {

                if (e.keyCode == 32) {

                    if (timeline.playing) {

                        timeline.tl.pause();
                        timeline.playing = false;
                    }
                    else {

                        timeline.tl.play();
                        timeline.playing = true;
                    }
                }
            });

            return $debugger;
        };


        self._updateTimeline = function (timeline) {

            if ('$debugger' in timeline) {
                timeline.$debugger.slider("value", timeline.tl.progress());
            }
        };


        /* Public */

        self.hold = function (hold) {

            self.context.hold = hold;
        };


        self.set = function ($element, animations, options) {

            $element.addClass('meta-timeline');

            options = $.extend({
                time_scale: false,
                start_at  : 0,
                end_at    : false,
                debug     : false,
                name      : 'unnamed'
            }, options);

            var timeline = {};
            var tl  = new TimelineLite({
                paused    : true,
                onUpdate  : function () { self._updateTimeline(timeline) },
                onComplete: function () { timeline.playing = false }
            });

            tl.add("stagger");

            for (var i = 0; i < animations.length; i++) {

                var keypoint = animations[i];

                if ('call' in keypoint) {

                    if (!'position' in keypoint) {
                        keypoint.position = false;
                    }

                    if (!'params' in keypoint) {
                        keypoint.params = [];
                    }

                    tl.call(keypoint.call, keypoint.params, null, keypoint.position);
                }
                else {

                    if ('from' in keypoint || 'to' in keypoint) {

                        keypoint.animation = 'from' in keypoint ? keypoint.from : keypoint.to;

                        if ('ease' in keypoint) {
                            keypoint.animation.ease = keypoint.ease;
                        }

                        keypoint.animation.force3D = true;

                        if ('onComplete' in keypoint) {
                            keypoint.animation.onComplete = keypoint.onComplete;
                        }
                    }

                    if (!'position' in keypoint) {
                        keypoint.position = false;
                    }

                    var $target = keypoint.element instanceof $ ? keypoint.element : $element.find(keypoint.element);

                    if ($target.length) {

                        if (!$target.hasClass('meta-timeline__element')) {
                            $target.addClass('meta-timeline__element');
                        }

                        if ('set' in keypoint) {

                            tl.set($target, keypoint.set, keypoint.position);
                        }
                        else {

                            if ('to' in keypoint) {
                                tl.to($target, keypoint.duration, keypoint.animation, keypoint.position);
                            } else {
                                tl.from($target, keypoint.duration, keypoint.animation, keypoint.position);
                            }
                        }
                    }
                }
            }

            if (options.time_scale) {
                tl.timeScale(options.time_scale);
            }

            tl.seek(0.01);

            if (options.debug) {
                console.log('Initialized ' + options.name + ' : ' + Math.round(tl.totalDuration()) + 's');
            }

            timeline = {
                tl           : tl,
                start_at     : options.start_at,
                end_at       : options.end_at,
                played       : false,
                playing      : false,
                follow_scroll: options.end_at,
                debug        : options.debug,
                name         : options.name
            };

            self.context.timelines.push(timeline);

            if (options.debug) {
                timeline.$debugger = self._addDebugger($element, timeline);
            }

            self._play();

            return tl;
        };


        self.__construct();
    };

    rocket          = typeof rocket == 'undefined' ? {} : rocket;
    rocket.timeline = new Timeline();

})(jQuery);