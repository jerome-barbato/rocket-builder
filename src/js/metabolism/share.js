/**
 * Share
 *
 * Copyright (c) 2017 - Metabolism
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

var MetaShare = function()
{
    var self = this;

    /* Public */

    self.facebook = function( link, scrape )
    {
        if( scrape && typeof FB !== 'undefined' )
        {
            FB.api('https://graph.facebook.com/', 'post', { id: link, scrape: true}, function(response)
            {
                if (response)
                    FB.ui({method: 'feed', link: link});
            });
        }
        else
        {

            if( typeof FB !== 'undefined' )
            {
                FB.ui({method: 'feed', link: link});
            }
            else
            {
                var url = 'http://www.facebook.com/sharer.php?u=' + encodeURIComponent(link);
                self._openWindow(url, 'facebookwindow', 533, 355);
            }
        }
    };


    self.twitter = function( link, text, share_link )
    {
        var url = 'https://twitter.com/intent/tweet?text='+encodeURIComponent(text);

        if( share_link )
            url += '&url='+encodeURIComponent(link);

        self._openWindow(url, 'twitterwindow', 550, 254);
    };


    self.linkedin = function(link, title, summary)
    {
        var url     = 'https://www.linkedin.com/shareArticle?mini=true&url='+encodeURIComponent(link)+'&title='+encodeURIComponent(title)+'&summary='+encodeURIComponent(summary);
        self._openWindow(url, 'linkedinwindow', 560, 510);
    };


    self.gplus = function( link )
    {
        var url = 'https://plus.google.com/share?url='+encodeURIComponent(link);
        self._openWindow(url, 'gpluswindow', 518, 572);
    };


    self.pinterest = function( link, media, description )
    {
        var url = 'http://www.pinterest.com/pin/create/button/?url='+encodeURIComponent(link);

        if( media )
            url += '&media='+encodeURIComponent(media);

        if(description)
            url += '&description='+encodeURIComponent(description);

        self._openWindow(url, 'pinterestwindow', 750, 533);
    };


    self.mail = function(link, subject, body)
    {
        var url = 'mailto:?';

        var is_first = true;

        if( subject ) {

            url += (!is_first ? '&':'') + 'subject=' + encodeURIComponent(subject);

            if (is_first)
                is_first = false;
        }

        if(body) {

            url += (!is_first ? '&':'') + 'body=' + encodeURIComponent(body).replace(/%5Cn/g, '%0D%0A');

            if (is_first)
                is_first = false;
        }

        if(!body)
        {
            url += (!is_first ? '&':'') + 'body=';

            if (is_first)
                is_first = false;
        }

        url += '%20'+encodeURIComponent(link);

        return url;
    };



    /* Private */


    self._openWindow = function(url, name, width, height)
    {
        var screenLeft=0, screenTop=0;

        if(!name) name     = 'MyWindow';
        if(!width) width   = 600;
        if(!height) height = 600;

        if(typeof window.screenLeft !== 'undefined')
        {
            screenLeft = window.screenLeft;
            screenTop  = window.screenTop;

        } else if(typeof window.screenX !== 'undefined')
        {
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


    self.share = function(target, element)
    {
        var $elem = $(element);
        var link  = $elem.attr('href');

        switch (target)
        {
            case 'facebook':

                var scrape = $elem.hasDataAttr('scrape') ? $elem.data('scrape') : false;
                self.facebook(link, scrape);
                break;

            case 'twitter':

                var text = $elem.hasDataAttr('tweet') ? $elem.data('tweet') : '';
                var share_link = $elem.hasDataAttr('link') ? $elem.data('link') : true;

                share_link = share_link != "false" && share_link;

                self.twitter(link, text, share_link);
                break;

            case 'linkedin':

                var title   = $elem.hasDataAttr('title') ? $elem.data('title') : '';
                var summary = $elem.hasDataAttr('summary') ? $elem.data('summary') : '';

                self.linkedin(link, title, summary);
                break;

            case 'pinterest':

                var media       = $elem.hasDataAttr('media') ? $elem.data('media') : false;
                var description = $elem.hasDataAttr('description') ? $elem.data('description') : false;

                self.pinterest( link, media, description );
                break;

            case 'gplus':

                self.gplus(link);
                break;
        }
    };


    /* Contructor. */

    /**
     *
     */
    self.__construct =  function()
    {
        $('[data-share_on]').initialize(function()
        {
            var target = $(this).data('share_on');

            if ( target == 'mail' )
            {
                var link    = $(this).attr('href');
                var subject = $(this).hasDataAttr('subject') ? $(this).data('subject') : false;
                var body    = $(this).hasDataAttr('body') ? $(this).data('body') : false;

                $(this).attr('href', self.mail(link, subject, body));
            }
            else
            {
                $(this).click(function(e){

                    e.preventDefault();
                    self.share(target, this);
                });
            }
        });
    };


    if( typeof DOMCompiler !== "undefined" )
    {
        dom.compiler.register('attribute', 'share-on', function(elem, attrs)
        {
            elem.attr('data-share_on', attrs.shareOn);
        });
    }

    $(document).on('boot', self.__construct);
};

var meta = meta || {};
meta.share = new MetaShare();
