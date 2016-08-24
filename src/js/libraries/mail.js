/**
 * Mail
 *
 * Copyright (c) 2014 - Metabolism
 * Author:
 *   - Jérome Barbato <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 1.1
 *
 * Requires:
 *   - jQuery
 *
 **/

var UIMail = function(){

    var self = this;



    /* Contructor. */

    self._resolve = function(){

        var email = $(this).data('name')+'@'+$(this).data('domain');

        $(this).attr('href', 'mailto:'+email);

        $(this).removeAttr('data-name').removeAttr('data-domain');

        if( !$(this).text().length )
            $(this).text(email);

        $(this).removeClass('ui-mail');
    };



    /**
     *
     */
    self.__construct =  function(){

        $('.ui-mail').initialize(self._resolve);
    };


    if( typeof DOMCompiler !== "undefined" ) {

        dom.compiler.register('attribute', 'mailto', function (elem, attrs) {

            var mail = attrs.mailto.split('|');

            elem.attr('data-name', mail[0]);
            elem.attr('data-domain', mail[1]);

            elem.addClass('ui-mail');
        });
    }


    $(document).on('boot', self.__construct);
};

var ui = ui || {};
ui.mail = new UIMail();