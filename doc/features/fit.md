# Fit
   
###### file: js/metabolism/fit.js
   
Object fit cover/contain with polyfill.
 
For image and video width and height are mandatory ( especially for IE )

### Fit

~~~~
<div>
    <img src="myimage.jpg" width="640" height="450" object-fit="contain"/>
</div>
~~~~

Contain or cover

### Position

~~~~    
<div>
    <img src="myimage.jpg" width="640" height="450" object-fit="cover" object-position="bottom center"/>
</div>
~~~~

### Javascript
      
A JS extension is available to resize specific element manually

~~~~   
$container.find('.ui-fit').fit();
~~~~
