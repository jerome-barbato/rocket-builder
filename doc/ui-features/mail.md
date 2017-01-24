# Mail
   
###### file: js/libraries/mail.js
    
Mail spam protection
 
##### Options :

* write : add plain text email address
* link : add mailto link
   
~~~~
<a class="ui-mail" data-name="contact" data-domain="gmail.com" data-inline="1">
~~~~

Once parsed when the dom is loaded, the result will be
  
~~~~
<a class="ui-mail" href="mailto:contact@gmail.com">contact@gmail.com</a>
~~~~