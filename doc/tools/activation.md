# Activation
     
###### file: js/libraries/activation.js, sass/libraries/_activation.scss

Add class/animate element while scrolling, add ui-activation--active and ui-activation--seen class

~~~~
<div when-visible="fade"></div>
<div when-visible="stack" visibility="20%">
    <div delay="0"></div>
    <div animation="fade-in" delay="1" easing="in-out-back"></div>
    <div delay="d:2 m:0"></div>
</div>
~~~~
  
Available animations are :

* fade-in
* fade-out
* slide-up
* slide-down
* slide-left
* slide-right
* zoom-out
* zoom-in
* rotate-x
* rotate-y
* stack
* increment