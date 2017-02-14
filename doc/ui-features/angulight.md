# Angulight
     
###### file: js/libraries/angulight.js

### Without parameter

push-data.phtml.twig
~~~~
<div block="push-data" controller="data"></div>
~~~~
    
controller/data.js

~~~~
angulight.controller('data', function($dom){});
~~~~

### With parameters

~~~~
<div block="push-data" controller="data('red','blue')"></div>
~~~~
    
controller/data.js

~~~~
angulight.controller('data', function($dom, color1, color2){

  console.log(color1);
});
~~~~
