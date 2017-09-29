/**
 * Popin
 *
 * Copyright (c) 2016 - Metabolism
 * Author:
 *   - Metabolism <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 1.0
 *
 * Requires:
 *   - jQuery
 *
 * Changelog:
 *
 *
 **/

(function ($) {

    var Router = function () {
        var self = this;


        /* Public */

        self.config = {
            animations   : {
                enter: 'fade-in',
                leave: 'fade-out'
            },
            scroll_to_top: false
        };

        self.context = {
            animation    : $('meta[name="animation-router"]').attr('content'),
            pages        : false,
            current_path : '',
            previous_path: '',
            animation_end: 'animationend.router oanimationend.router webkitAnimationEnd.router MSAnimationEnd.router'
        };


        /* Contructor. */

        self.__construct = function () {
            if (typeof self.context.animation != 'undefined') {
                self.config.animations.enter = self.context.animation + '-in';
                self.config.animations.leave = self.context.animation + '-out';
            }

            $(window).on('hashchange', function () {
                self.gotoPath(self._getPath(), function () {
                    if (self.config.scroll_to_top) {
                        $(window).scrollTop(0);
                    }
                });
            });

            self.context.pages    = $('[data-page]');
            self.context.triggers = $('[href^="#!/"]');

            if (location.hash && location.hash.indexOf('/') == 1) {
                self.gotoPath(self._getPath());
            }
            else {
                var path = self._findDefaultPath();

                if (path) {
                    location.hash = path;
                }
            }
        };


        /* Private */

        self._setActiveTriggers = function () {
            $('body').attr('data-route', self.context.current_path.replace(/\//g, '_'));

            self.context.triggers.removeClass('route--active');

            var path = [];

            $.each(self.context.current_path.split('/'), function (index, element) {
                path.push(element);
                self.context.triggers.filter('[href="#!/' + path.join('/') + '"]').addClass('route--active');
            })
        };


        self.gotoPath = function (path, callback) {
            var $page = self.context.pages.filter("[data-page='" + path + "']");

            if (path && path.length && $page.length) {
                var $subpage     = $page.find('[data-default]');
                var loaded_pages = 0;

                if ($subpage.length) {
                    location.hash = '/' + $subpage.first().data('page');
                }
                else {
                    self.context.previous_path = self.context.current_path;
                    self.context.current_path  = path;

                    self._setActiveTriggers();

                    path = path.split('/');

                    var previous_path = self.context.previous_path.split('/');

                    var complete_prev_path = [];
                    var complete_new_path  = [];

                    $.each(path, function (index, new_path) {
                        complete_new_path.push(new_path);

                        if (previous_path.length > index) {
                            complete_prev_path.push(previous_path[index]);

                            if (previous_path[index] != new_path) {
                                self._unloadPage(complete_prev_path.join('/'));
                                previous_path = [];
                            }
                        }

                        if (previous_path.length < index || previous_path[index] != new_path) {
                            self._loadPage(complete_new_path.join('/'));
                            loaded_pages++;

                            if (loaded_pages == path.length && callback) {
                                callback()
                            }
                        }
                    })
                }
            }
        };


        self._unloadPage = function (path, callback) {
            var $page       = self.context.pages.filter("[data-page='" + path + "']");
            var leave_class = 'router--leave router--' + self.config.animations.leave;

            var unloadComplete = function () {
                $page.removeAttr('data-current');
                $page.removeClass(leave_class);
                $page.find('[data-page]').removeAttr('data-current');

                if (callback) callback();
            };

            if ($page && $page.length) {
                if (self.config.animations && self.config.animations.leave) {
                    $page.unbind(self.context.animation_end).one(self.context.animation_end, unloadComplete);
                    $page.addClass(leave_class);
                }
                else {
                    unloadComplete();
                }
            }
        };


        self._loadPage = function (path, callback) {
            var $page = self.context.pages.filter("[data-page='" + path + "']");

            if ($page) {
                if (self.config.animations && self.config.animations.enter) {
                    var enter_class = 'router--' + self.config.animations.enter + ' router--enter';

                    $page.unbind(self.context.animation_end).one(self.context.animation_end, function () {
                        $page.removeClass(enter_class);

                        setTimeout(function () {
                            $(document).trigger('router.hasChanged');
                            $(window).resize()
                        });

                        if (callback) callback();
                    });

                    $page.attr('data-current', '').addClass(enter_class);
                }
                else {
                    $page.attr('data-current', '');

                    setTimeout(function () {
                        $(document).trigger('router.hasChanged');
                        $(window).resize()
                    });

                    if (callback) callback();
                }
            }
        };


        self._findDefaultPath = function ($page) {
            var path = '';

            if (typeof $page == "undefined") {
                $page = $('body');
            }

            if ($page.length) {
                if (typeof $page.attr('data-page') != 'undefined') {
                    path = $page.data('page');
                }

                var $subpage = $page.find("[data-page][data-default]").first();

                if ($subpage.length) {
                    return self._findDefaultPath($subpage)
                }
            }

            return path.length ? '!/' + path : false;
        };


        self._getPath = function () {
            var path = false;

            if (location.hash) {
                path = location.hash.replace("#!/", "");
            }

            if (self.context.current_path != path) {
                return path;
            }

            return false;
        };


        $(document).ready(self.__construct);
    };

    rocket        = typeof rocket == 'undefined' ? {} : rocket;
    rocket.router = new Router();

})(jQuery);