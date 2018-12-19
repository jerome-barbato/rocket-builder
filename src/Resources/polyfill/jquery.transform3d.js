/*
 * transform: A jQuery cssHooks adding 2D/3D transform capabilities to $.fn.css() and $.fn.animate()
 *
 * Requirements:
 * - jQuery 1.5.1+
 * - jquery.transition.js for animations
 * - browser implementing W3C's CSS 2DTransforms for 2D tranform
 * - browser implementing W3C's CSS 3DTransforms for 3D tranform
 *
 * latest version and complete README available on Github:
 * https://github.com/louisremi/jquery.transform.js
 *
 * Copyright 2011 @louis_remi
 * Licensed under the MIT license.
 *
 * This saved you an hour of work?
 * Send me music http://www.amazon.co.uk/wishlist/HNTU0468LQON
 *
 */
!function(e,t,r){"use strict";function s(e){return e.slice(0,1).toUpperCase()+e.slice(1)}for(var i,n,o=r.createElement("div"),c=o.style,a=["O","ms","Webkit","Moz"],p=a.length,f=["transform","transformOrigin","transformStyle","perspective","perspectiveOrigin","backfaceVisibility"],l=a.length;p--;)a[p]+s(f[0])in c&&(i=a[p]);if(i)for(;l--;)n=i+s(f[l]),n in c&&(e.cssNumber[f[l]]=!0,e.cssProps[f[l]]=n,"MozTransform"===n&&(e.cssHooks[f[l]]={get:function(t,r){return r?e.css(t,n).split("px").join(""):t.style[n]},set:function(e,t){/matrix\([^)p]*\)/.test(t)&&(t=t.replace(/matrix((?:[^,]*,){4})([^,]*),([^)]*)/,"matrix$1$2px,$3px")),e.style[n]=t}}))}(jQuery,window,document);
