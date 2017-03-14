# Popin

###### file: js/metabolism/popin.js, sass/metabolism/popin.scss

Display content using fullscreen popin.

You need a trigger and a template, the template id and the trigger data template must be the same
     
### Trigger

~~~~
<a popin="my-popin"></a>
~~~~
    
### Define popin template

~~~~
<template id="my-popin">
   <!-- my popin content -->
</template>
~~~~

### Options

You can add options to the popin via the trigger directly

~~~~
<a popin="youtube" data-youtube_id="W45FXXDF"></a>
~~~~
~~~~
<template id="youtube">
    <iframe width="560" height="315" src="//www.youtube.com/embed/[[youtube_id]]"></iframe>
</template>
~~~~
     
The following markup will be added animated to the document you can style the popin using the .ui-popin--youtube selector

~~~~
<div class="ui-popin ui-popin--youtube">
    <div class="valign">
        <div class="valign__middle">
            <div class="ui-popin__content">
                <a class="ui-popin__close"></a>
                <iframe width="560" height="315" src="//www.youtube.com/embed/W45FXXDF"></iframe>
            </div>
        </div>
    </div>
</div>
~~~~
     
### Javascript

Open popin : custom html no template in the DOM

~~~~
var popin = new rocket.popin('youtube', '<iframe width="315" height="315" src="//www.youtube.com/embed/W45FXXDF"></iframe>');
~~~~
    
Generate popin : template already in the DOM, id in context

~~~~
var popin = new rocket.popin('youtube', false, {youtube_id:'W45FXXDF'});
~~~~
    
Generate popin : template already in the DOM, id in context, do not remove on clode

~~~~
var popin = new rocket.popin('youtube', false, {youtube_id:'W45FXXDF', remove:false});
~~~~
     
Public function

~~~~
popin.close();
popin.show();

// Return jQuery element
popin.get();
~~~~

### Events

Events are triggered for each action

~~~
$(document).on('popin.added', function($popin, id, context){ });
~~~
~~~
$(document).on('popin.remove', function(id){ });
~~~~

You can trigger event on popin too

~~~
var $popin = $('.popin--youtube');
$popin.trigger('popin.show');
$popin.trigger('popin.close');
~~~
