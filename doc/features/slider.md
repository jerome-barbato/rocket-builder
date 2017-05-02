# Slider
   
######file: js/metabolism/sliders.js, sass/metabolism/sliders.scss
 
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
     
The height of swiper-container must be set in css.

Pagination and arrows are not required.
    
If pagination is empty, child will be added.
If arrows is empty, two arrows will be added.
    
Options can be added in html to the slider to choose the animation type, hold and autoplay options,

### Animations

~~~~
<slider data-animation="slide">
~~~~
    
Available animations are :

* vertical
* crossfade
* horizontal
* zoom 
* stack 


### Autoplay

~~~~
<slider data-autoplay="2000">
~~~~

### Hold

Pause autoplay when mouse is over the slider

~~~~
<slider data-hold="1">
~~~~

### Start slide

~~~~
<slider data-start_slide="1">
~~~~

### Disable swipe detection

~~~~
<slider data-swipe_tablet="0" data-swipe_mobile="0" data-swipe_desktop="0">
~~~~

### Loop

~~~~
<slider data-loop="0">
~~~~

### Sync

~~~~
<slider id="slider1"></slider>

<slider data-sync="slider1"></slider>
~~~~

### Pack Slide

~~~~
<slider data-display="desktop:3,phone:1">
~~~~

Display: desktop, mobile, tablet, phone

### Height

~~~~
<slider data-height="300">
~~~~
~~~~
<slider data-height="auto">
~~~~

