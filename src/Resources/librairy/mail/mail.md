# Mail
   
###### file: js/metabolism/mail.js
    
Mail spam protection
 
##### Options :

* write : add plain text email address
* link : add mailto link
   
~~~~
<a mailto="test@domain.fr">@</a>
~~~~

Once parsed when the dom is loaded, the result will be
  
~~~~
<a href="mailto:test@domain.fr">test@domain.fr</a>
~~~~

Using Twig 

~~~~
{{ 'test@domain.fr'|protect_email }}
~~~~

