/**
 * Share
 *
 * Copyright (c) 2014 - Metabolism
 * Author:
 *   - Jérome Barbato <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 1.3
 *
 * Requires:
 *   - jQuery
 *
 * Changelog:
 *   - added linkedIn
 *   - added twitter option to share url
 *
 **/

var UIShare = function(){

    var that = this;

    /* Public */

    that.facebook = function( link, scrape ){

        if( scrape && typeof FB !== 'undefined' ) {

            FB.api('https://graph.facebook.com/', 'post', { id: link, scrape: true}, function (response) {

                if (response)
                    FB.ui({method: 'feed', link: link});
            });
        }
        else {

            if( typeof FB !== 'undefined' ){

                FB.ui({method: 'feed', link: link});
            }
            else{

                var url = 'http://www.facebook.com/sharer.php?u=' + encodeURIComponent(link);
                that._openWindow(url, 'facebookwindow', 533, 355);
            }
        }
    };


    that.twitter = function( link, text, share_link ){

        var url = 'https://twitter.com/intent/tweet?text='+encodeURIComponent(text);

        if( share_link )
            url += '&url='+encodeURIComponent(link);

        that._openWindow(url, 'twitterwindow', 550, 254);
    };


    that.linkedin = function(link, title, summary){

        var url     = 'https://www.linkedin.com/shareArticle?mini=true&url='+encodeURIComponent(link)+'&title='+encodeURIComponent(title)+'&summary='+encodeURIComponent(summary);
        that._openWindow(url, 'linkedinwindow', 560, 510);
    };


    that.gplus = function( link ){

        var url = 'https://plus.google.com/share?url='+encodeURIComponent(link);
        that._openWindow(url, 'gpluswindow', 518, 572);
    };


    that.pinterest = function( link, media, description ){

        var url = 'http://www.pinterest.com/pin/create/button/?url='+encodeURIComponent(link);

        if( media )
            url += '&media='+encodeURIComponent(media);

        if(description)
            url += '&description='+encodeURIComponent(description);

        that._openWindow(url, 'pinterestwindow', 750, 533);
    };


    that.mail = function(link, subject, body){

        var url = 'mailto:?';

        var is_first = true;

        if( subject ) {

            url += (!is_first ? '&':'') + 'subject=' + encodeURIComponent(subject);
            if (is_first) {
                is_first = false;
            }
        }

        if(body) {

            url += (!is_first ? '&':'') + 'body=' + encodeURIComponent(body).replace(/%5Cn/g, '%0D%0A');
            if (is_first) {
                is_first = false;
            }
        }

        if(!body) {

            url += (!is_first ? '&':'') + 'body=';
            if (is_first) {
                is_first = false;
            }
        }

        url += '%20'+encodeURIComponent(link);

        return url;
    };



    /* Private */


    that._openWindow = function(url, name, width, height) {

        var screenLeft=0, screenTop=0;

        if(!name) name     = 'MyWindow';
        if(!width) width   = 600;
        if(!height) height = 600;

        if(typeof window.screenLeft !== 'undefined') {

            screenLeft = window.screenLeft;
            screenTop  = window.screenTop;

        } else if(typeof window.screenX !== 'undefined') {

            screenLeft = window.screenX;
            screenTop  = window.screenY;
        }

        var features_dict = {
            toolbar : 'no', location : 'no', directories : 'no',
            left : screenLeft + ($(window).width() - width) / 2,
            top : screenTop + ($(window).height() - height) / 2,
            status : 'yes', menubar : 'no', scrollbars : 'yes', resizable : 'no',
            width : width, height : height
        };

        var features_arr = [];

        for(var k in features_dict)
            features_arr.push(k+'='+features_dict[k]);

        var features_str = features_arr.join(',');

        var win = window.open(url, name, features_str);
        win.focus();

        return false;
    };


    /* Contructor. */

    /**
     *
     */
    that.__construct =  function(){

        $(document).on('click', '.ui-share', function(e){

            if (! $(this).hasClass('ui-share--mail'))
                e.preventDefault();

            var link = $(this).attr('href');

            if( $(this).hasClass('ui-share--facebook') ){

                var scrape = $(this).hasDataAttr('scrape') ? $(this).data('scrape') : false;

                that.facebook(link, scrape);
            }
            else if( $(this).hasClass('ui-share--twitter') ){

                var text = $(this).hasDataAttr('tweet') ? $(this).data('tweet') : '';
                var share_link = $(this).hasDataAttr('link') ? $(this).data('link') : true;

                share_link = share_link != "false" && share_link;

                that.twitter(link, text, share_link);
            }
            else if( $(this).hasClass('ui-share--linkedin') ){

                var title   = $(this).hasDataAttr('title') ? $(this).data('title') : '';
                var summary = $(this).hasDataAttr('summary') ? $(this).data('summary') : '';

                that.linkedin(link, title, summary);
            }
            else if( $(this).hasClass('ui-share--pinterest') ){

                var media       = $(this).hasDataAttr('media') ? $(this).data('media') : false;
                var description = $(this).hasDataAttr('description') ? $(this).data('description') : false;

                that.pinterest( link, media, description );
            }
            else if( $(this).hasClass('ui-share--gplus') ){

                that.gplus(link);
            }
        });

        $('.ui-share--mail').each(function(){

            var link     = $(this).attr('href');
            var subject  = $(this).hasDataAttr('subject') ? $(this).data('subject') : false;
            var body     = $(this).hasDataAttr('body') ? $(this).data('body') : false;

            $(this).attr('href', that.mail(link, subject, body));
        });
    };


    if( typeof DOMCompiler !== "undefined" ) {

        dom.compiler.register('attribute', 'share-on', function (elem, attrs) {

            elem.addClass('ui-share ui-share--' + attrs.shareOn);
        });
    }

    $(document).on('boot', that.__construct);
};

var ui = ui || {};
ui.share = new UIShare();