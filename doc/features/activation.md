# Activation
     
###### files: js/metabolism/activation.js, sass/metabolism/activation.scss,  sass/metabolism/animations.scss, sass/framework/animations.scss

Play animation while scrolling,

Add data-activation attribute according to its state : wait, play, played, rewind

~~~~
<div when-visible="fade"></div>
<div when-visible="fade" easing="in-out-back"></div>
<div when-visible="stack" visibility="20%">
    <div delay="0"></div>
    <div animation="fade-in" delay="1" easing="in-out-back"></div>
</div>
~~~~
  
Available animations are :

* fade-in
* slide-up
* slide-down
* slide-left
* slide-right
* unzoom-in
* zoom-in
* rotate-x
* rotate-y
* rotate-in
* pop
* enlarge
* stack
* increment
* reveal

Note that rotate-x and rotate-y need perspective on its parent

### Mobile

To enable on mobile, in the header add 

~~~
<meta name="animation-mobile" content="yes">
