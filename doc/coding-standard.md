# Coding Standard

`todo: add details`

## Structure

All related files must have the same name/class/function name

###### ex: creating a block data with a controller

data.phtml.twig 

~~~~
<div block="Data"></div>
~~~~
    
data.scss

~~~~
.Data{}
~~~~
    
data.js

~~~~
var dataController = function(){}
or
angulight.controller('data', function($dom){});
~~~~
    
If the block has a parent

###### ex : creating a block data with a controller with a parent named push

push/data.phtml.twig 

~~~~
<div block="Push-Data"></div>
~~~~
    
push/data.scss

~~~~
.Push-Data{}
~~~~
    
push/data.js

~~~~
var pushDataController = function(){}
or
angulight.controller('push-data', function($dom){});
~~~~
    
    
## Javascript

String variable must use single quote, to avoid double quote escaping on html content

~~~~
var push = '<div class="Push"></div>';
~~~~
    
jQuery object variable must use dollar sign in its name
    
~~~~
var $push = $('.Push');
~~~~