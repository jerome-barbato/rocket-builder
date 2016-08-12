/**
 * Activation
 *
 * Copyright (c) 2016 - Metabolism
 * Author:
 *   - Paul Coudeville <paul@metabolism.fr>
 *
 * License: GPL
 * Version: 1.0
 *
 **/

var cookieHandler = function() {

    var that = this;


    /**
     * Throw new error if no cookies
     * @private
     */
    that.__construct = function() {
        if (navigator.cookieEnabled) {
            throw new Error("Cookies are not allowed.");
        }
    };

    /**
     * Cookier Setter
     * @param cname String name of the cookie
     * @param cvalue * value of the cookie
     * @param exdays String day amount before expiration
     */
    that.setCookie = function(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    };

    /**
     * Cookie getter
     * @param cname String name of the cookie
     * @returns {*} Cookie | ""
     */
    that.getCookie = function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };

};

var cookies = new cookieHandler();