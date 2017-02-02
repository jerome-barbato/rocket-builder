# Slider
   
######file: js/libraries/sliders.js, sass/vendor/meta/_sliders.scss
 
Manage sliders interface, slides, arrows and pagination sliders can be imbricated.

~~~~          
<slider>
    <slides>
        <slide></slide>
        <slide></slide>
        <slide></slide>
    </slides>
    <pagination></pagination>
    <arrows></arrows>
</slider>
~~~~
     
The height of ui-slider must be set in css
pagination and arrows are not required.
    
If pagination is empty, child will be added.

If arrows is empty, two arrows will be added.
 
## Options    

Options can be added in html to the slider to choose the animation type, hold and autoplay options,
for now setting speed completely override the transition attribute defined in css, not only the time

### Animation
~~~~
<slider context="'animation':'slide'"></slider>
~~~~
    
Available animations are :

* vertical
* crossfade
* horizontal
* zoom 

### Autoplay
~~~~
<slider context="'autoplay':2000,'loop':true"></slider>
~~~~

Change slide each 2s, 2000ms

### Hold
~~~~
<slider context="'autoplay':2000,'hold':true"></slider>
~~~~

Pause autoplay when cursor is over the slider

### Display
~~~~
<slider context="'display':{desktop:1,tablet:2,mobile:4,phone:6}"></slider>
~~~~

Depending on the device, group slides.

### Sync
~~~~
<slider context="'sync':'second'" id="first"></slider>
<slider id="second"></slider>
~~~~

Keep both slider sync 
