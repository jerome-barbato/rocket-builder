# Popin

###### file: js/libraries/popin.js, sass/libraries/_popin.scss

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
     
### You can open/close a popin via javascript directly

Open popin : custom html no template in the DOM

~~~~
ui.popin.add('youtube', '<iframe width="560" height="315" src="//www.youtube.com/embed/W45FXXDF"></iframe>');
~~~~
    
Generate popin : template already in the DOM, id

~~~~
ui.popin.add('youtube', false, {youtube_id:'W45FXXDF'});
~~~~
     
Close popin via id

~~~~
ui.popin.close('youtube');
~~~~