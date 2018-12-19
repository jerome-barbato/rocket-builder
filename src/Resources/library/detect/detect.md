# Detect

######file:  js/metabolism/detect.js

### Detection

Add class according to the asked detection, also trigger js event.

~~~~
<div detect="on-top" class="element"></div>
~~~~

Available detection: on-top, visible, appear, disappear

### Offset

You can reference your fixed header/footer to ensure a right calculation

~~~~
<header fixed="top"></header>
<footer fixed="bottom"></fixed>
~~~~

### Body

This script also add class and attribute on body according to the current scroll state
Delay detection using parameter, scroll_offset default value is 5

~~~
<body data-scroll_offset="100"></header>
~~~

### Events

Trigger events according to the detection

~~~
$('.element').on('detect.on-top', function(){ });
~~~