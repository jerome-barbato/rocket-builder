/**
 * HTTP Ajax sender
 * with async bevahior and Promise
 *
 * Copyright (c) 2016 - Metabolism
 * Author:
 *   - Paul Coudeville <paul@metabolism.fr>
 *
 * License: GPL
 * Version: 1.0
 *
 * USAGE :
 * -------
 *
 * $http("http://myurl.com")
 * .get({"myargs": "value"})
 * .then(callback.successFunction)
 * .catch(callback.errorFunction);
 *
 * -----
 *
 **/

var http = function(url) {

    var core = {

        // Ajax request method
        ajax : function (method, url, args) {

            // Return the promise
            return new Promise(function (resolve, reject) {

                var client = new XMLHttpRequest();
                var uri = url;

                if (args && (method === 'POST' || method === 'PUT')) {
                    uri += '?';
                    var argcount = 0;
                    for (var key in args) {
                        if (args.hasOwnProperty(key)) {
                            if (argcount++) {
                                uri += '&';
                            }
                            uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
                        }
                    }
                }

                client.open(method, uri);
                client.send();

                client.onload = function () {
                    if (this.status >= 200 && this.status < 300) {
                        // "resolve" function usage when this.status is equal to 2xx
                        resolve(this.response);
                    } else {
                        // "reject" function usage when this.status is different from 2xx
                        reject(this.statusText);
                    }
                };
                client.onerror = function () {
                    reject(this.statusText);
                };
            });
        }
    };

    // Pattern adaptator
    return {
        'get' : function(args) {
            return core.ajax('GET', url, args);
        },
        'post' : function(args) {
            return core.ajax('POST', url, args);
        },
        'put' : function(args) {
            return core.ajax('PUT', url, args);
        },
        'delete' : function(args) {
            return core.ajax('DELETE', url, args);
        }
    };
};
