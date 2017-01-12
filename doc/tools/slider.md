Slider
-----------
   
file: js/libraries/sliders.js, sass/vendor/meta/_sliders.scss
 
Manage sliders interface, slides, arrows and pagination sliders can be imbricated
            
    <slider>
        <slides>
            <slide></slide>
            <slide></slide>
            <slide></slide>
        </slides>
        <pagination></pagination>
        <arrows></arrows>
    </slider>
     
height of ui-slider must be set in css
pagination and arrows are not required
    
if pagination is empty, child will be added
if arrows is empty, two arrows will be added
    
options can be added in html to the slider to choose the animation type, hold and autoplay options,
for now setting speed completely override the transition attribute defined in css, not only the time

    <slider context="'animation':'slide', 'autoplay':2000, 'hold':false">
    
Available animations are : vertical, crossfade, horizontal, zoom 