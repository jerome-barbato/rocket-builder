# Fit
   
###### file: js/libraries/fit.js
   
Object fit cover/contain with polyfill.
 
For image and video width and height are mandatory
    
~~~~
<div>
    <img src="myimage.jpg" width="640" height="450" object-fit="contain"/>
</div>
~~~~
~~~~    
<div>
    <img src="myimage.jpg" width="640" height="450" object-fit="cover" object-position="bottom center"/>
</div>
~~~~
      
A JS extension is available to resize specific element manually

~~~~   
$container.find('.ui-fit').fit();
~~~~