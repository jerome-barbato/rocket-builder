/**
 * Cookie
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

    var self = this;


    /**
     * Throw new error if no cookies
     * @private
     */
    self.__construct = function() {
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
    self.set = function(cname, cvalue, exdays) {

        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + encodeURIComponent(cvalue) + "; " + expires;

        return true;
    };


    /**
     * Deleter
     * @param cname
     */
    self.delete = function(cname) {

        self.set(cname, false, -3600);
    };

    /**
     * Cookie getter
     * @param cname String name of the cookie
     * @param parse Boolean parseJson with try catch
     * @returns {*} Cookie | ""
     */
    self.get = function(cname, parse) {

        var name = cname + "=";
        var ca = document.cookie.split(';');

        for(var i = 0; i < ca.length; i++) {

            var c = ca[i];

            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }

            if (c.indexOf(name) == 0) {

                var value = c.substring(name.length, c.length);

                if( typeof parse !="undefined" && parse){

                    try {

                        value = JSON.parse(decodeURIComponent(value));

                    } catch (e) {

                        self.delete(cname);
                        value = false;
                    }
                }

                return value;
            }
        }

        return false;
    };

};

var cookies = new cookieHandler();