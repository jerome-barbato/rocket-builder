/*
 CSS Browser Selector v0.4.0 (Nov 02, 2010)
 Rafael Lima (http://rafael.adm.br)
 http://rafael.adm.br/css_browser_selector
 License: http://creativecommons.org/licenses/by/2.5/
 Contributors: http://rafael.adm.br/css_browser_selector#contributors

 v0.5.0 2011-08-24
 andrew relkin

 modified, now detects:
 any version of Firefox
 more versions of Windows (Win8, Win7, Vista, XP, Win2k)
 more versions of IE under unique conditions
 more detailed support for Opera
 if "no-js" in HTML class: removes and replaces with "js" (<html class="no-js">)

 identifies
 browsers: Firefox; IE; Opera; Safari; Chrome, Konqueror, Iron
 browser versions: (most importantly: ie6, ie7, ie8, ie9)
 rendering engines: Webkit; Mozilla; Gecko
 platforms/OSes: Mac; Win: Win7, Vista, XP, Win2k; FreeBSD; Linux/x11
 devices: Ipod; Ipad; Iphone; WebTV; Blackberry; Android; J2me; mobile(generic)
 enabled technology: JS

 v0.6.3 2014-03-06
 @silasrm <silasrm@gmail.com>
 - Added support to IE11
 @see http://msdn.microsoft.com/en-us/library/ie/hh869301(v=vs.85).aspx
 @see http://msdn.microsoft.com/en-us/library/ie/bg182625(v=vs.85).aspx

 v0.7 2016-02-12
 @metabolism <jerome@metabolism.fr>
 - Removed screensize test
 - added browser js variable with test results
 */

function css_browser_selector(u) {

    var browser = {},
        uaInfo  = {},
        ua      = u.toLowerCase(),
        is      = function (t) {
            var result = RegExp(t, "i").test(ua);
            t          = t.split('|');
            t.forEach(function (t) {
                browser[t.replace('/', '')] = result;
            });
            return result;
        },
        version = function (p, n) {
            n = n.replace(".", "_");
            var i = n.indexOf('_'), ver = "";
            while (i > 0) {
                ver += " " + p + n.substring(0, i);
                i = n.indexOf('_', i + 1);
            }
            ver += " " + p + n;
            return ver;
        },
        g       = 'gecko',
        w       = 'webkit',
        c       = 'chrome',
        f       = 'firefox',
        s       = 'safari',
        o       = 'opera',
        m       = 'mobile',
        d       = 'desktop',
        a       = 'android',
        bb      = 'blackberry',
        lang    = 'lang_',
        dv      = 'device_',
        html    = document.documentElement,
        b       = [

            // browser
            ((!(/opera|webtv/i.test(ua)) && /msie\s(\d+)/.test(ua) || (/trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.test(ua)))) ? ('ie ie' + (/trident\/4\.0/.test(ua) ? '8' : RegExp.$1 == '11.0' ? '11' : RegExp.$1))
                : is('firefox/') ? g + " " + f + (/firefox\/((\d+)(\.(\d+))(\.\d+)*)/.test(ua) ? ' ' + f + RegExp.$2 + ' ' + f + RegExp.$2 + "_" + RegExp.$4 : '')
                    : is('gecko/') ? g
                        : is('opera') ? o + (/version\/((\d+)(\.(\d+))(\.\d+)*)/.test(ua) ? ' ' + o + RegExp.$2 + ' ' + o + RegExp.$2 + "_" + RegExp.$4 : (/opera(\s|\/)(\d+)\.(\d+)/.test(ua) ? ' ' + o + RegExp.$2 + " " + o + RegExp.$2 + "_" + RegExp.$3 : ''))
                            : is('konqueror') ? 'konqueror'

                                : is('blackberry') ?
                                    ( bb +
                                        ( /Version\/(\d+)(\.(\d+)+)/i.test(ua)
                                                ? " " + bb + RegExp.$1 + " " + bb + RegExp.$1 + RegExp.$2.replace('.', '_')
                                                : (/Blackberry ?(([0-9]+)([a-z]?))[\/|;]/gi.test(ua)
                                                    ? ' ' + bb + RegExp.$2 + (RegExp.$3 ? ' ' + bb + RegExp.$2 + RegExp.$3 : '')
                                                    : '')
                                        )
                                    ) // blackberry

                                    : is('android') ?
                                        (  a +
                                            ( /Version\/(\d+)(\.(\d+))+/i.test(ua)
                                                ? " " + a + RegExp.$1 + " " + a + RegExp.$1 + RegExp.$2.replace('.', '_')
                                                : '')
                                            + (/Android (.+); (.+) Build/i.test(ua)
                                                ? ' ' + dv + ( (RegExp.$2).replace(/ /g, "_") ).replace(/-/g, "_")
                                                : ''    )
                                        ) //android

                                        : is('chrome') ? w + ' ' + c + (/chrome\/((\d+)(\.(\d+))(\.\d+)*)/.test(ua) ? ' ' + c + RegExp.$2 + ((RegExp.$4 > 0) ? ' ' + c + RegExp.$2 + "_" + RegExp.$4 : '') : '')

                                            : is('iron') ? w + ' iron'

                                                : is('applewebkit/') ?
                                                    ( w + ' ' + s +
                                                        ( /version\/((\d+)(\.(\d+))(\.\d+)*)/.test(ua)
                                                                ? ' ' + s + RegExp.$2 + " " + s + RegExp.$2 + RegExp.$3.replace('.', '_')
                                                                : ( / Safari\/(\d+)/i.test(ua)
                                                                    ?
                                                                    ( (RegExp.$1 == "419" || RegExp.$1 == "417" || RegExp.$1 == "416" || RegExp.$1 == "412" ) ? ' ' + s + '2_0'
                                                                        : RegExp.$1 == "312" ? ' ' + s + '1_3'
                                                                            : RegExp.$1 == "125" ? ' ' + s + '1_2'
                                                                                : RegExp.$1 == "85" ? ' ' + s + '1_0'
                                                                                    : '' )
                                                                    : '')
                                                        )
                                                    ) //applewebkit

                                                    : is('mozilla/') ? g
                                                        : ''

            // mobile
            ,
            is("android|mobi|mobile|j2me|iphone|ipod|ipad|blackberry|playbook|kindle|silk") ? m : d

            // os/platform
            ,
            is('j2me') ? 'j2me'
                : is('ipad|ipod|iphone') ?
                    (
                        (
                            /CPU( iPhone)? OS (\d+[_|\.]\d+([_|\.]\d+)*)/i.test(ua) ?
                                'ios' + version('ios', RegExp.$2) : ''
                        ) + ' ' + ( /(ip(ad|od|hone))/gi.test(ua) ? RegExp.$1 : "" )
                    ) //'iphone'
                    //:is('ipod')?'ipod'
                    //:is('ipad')?'ipad'
                    : is('playbook') ? 'playbook'
                        : is('kindle|silk') ? 'kindle'
                            : is('playbook') ? 'playbook'
                                : is('mac') ? 'mac' + (/mac os x ((\d+)[.|_](\d+))/.test(ua) ? ( ' mac' + (RegExp.$2) + ' mac' + (RegExp.$1).replace('.', "_")  ) : '' )
                                    : is('win') ? 'win' +
                                        (is('windows nt 6.2') ? ' win8'
                                                : is('windows nt 6.1') ? ' win7'
                                                    : is('windows nt 6.0') ? ' vista'
                                                        : is('windows nt 5.2') || is('windows nt 5.1') ? ' win_xp'
                                                            : is('windows nt 5.0') ? ' win_2k'
                                                                : is('windows nt 4.0') || is('WinNT4.0') ? ' win_nt'
                                                                    : ''
                                        )
                                        : is('freebsd') ? 'freebsd'
                                            : (is('x11|linux')) ? 'linux'
                                                : ''

            // user agent language
            ,
            (/[; |\[](([a-z]{2})(\-[a-z]{2})?)[)|;|\]]/i.test(ua)) ? (lang + RegExp.$2).replace("-", "_") + (RegExp.$3 != '' ? (' ' + lang + RegExp.$1).replace("-", "_") : '') : ''

            // beta: test if running iPad app
            ,
            ( is('ipad|iphone|ipod') && !is('safari') ) ? 'ipad_app' : ''


        ]; // b

    function retina() {
        var r = window.devicePixelRatio > 1;
        if (r) {
            html.className += ' retina';
            return true;
        }
        else {
            html.className += ' non-retina';
            return false;
        }
    }

    browser.retina = retina();

    var language = window.navigator.userLanguage || window.navigator.language;
    language     = language.split('-');
    language     = language[0];

    html.className += " lang-" + language;

    var cssbs      = (b.join(' ')) + " js ";
    html.className = ( cssbs + html.className.replace(/\b(no[-|_]?)?js\b/g, "")  ).replace(/^ /, "")
                                                                                  .replace(/ +/g, " ");
    browser.desktop  = !browser.mobile;
    browser.language = language;

    browser.tablet   = window.innerWidth > 425  && window.innerWidth < 1024;
    browser.phone    = window.innerWidth < 425;
    
    html.className += browser.tablet ? " tablet" : (browser.phone ? ' phone' : '');

    return browser;
}

window.browser = css_browser_selector(navigator.userAgent);
