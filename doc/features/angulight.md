# Angulight
     
###### file: js/libraries/angulight.js

### Call function on init without parameter

push-data.phtml.twig

~~~~
<div class="push-data" controller="data">
    <a class="element"></a>
</div>
~~~~
    
controller/data.js

~~~~
angulight.controller('data', function($dom){

    $dom.find('.element').text('it works');
});
~~~~

### Call function on init with parameters

~~~~
<div class="push-data" controller="data('red','blue')"></div>
~~~~
    
controller/data.js

~~~~
angulight.controller('data', function($dom, color1, color2){

  console.log(color1);
});
~~~~

### Use HTML template and inject data
~~~~
<template id="popin">
  <h1>[[title]]</h1>
</template>

angulight.template('popin', {title:"Lorem ipsum"});
~~~~

### Remove element function of the device

~~~~
<div class="push-data" remove-on="phone">Remove on phone</div>
~~~~

### Remove element function of variable

~~~~
<div class="push-data" if="0">Hide</div>

<div class="push-data" if="1">Show</div>

<div class="push-data" if-not="1">Hide</div>

<div class="push-data" if-not="0">Show</div>
~~~~
