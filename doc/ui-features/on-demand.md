# On demand
   
###### file: js/libraries/on-demand.js

Load image/video when needed
      
~~~~
<img src="{{ sizer('4/3') }}" on-demand="http://lorempixel.com/640/480/nature/1"/>
~~~~

Preload the video when needed, play when visible, handle mp4/webm

~~~~
<video width="640" height="480"
on-demand="https://s3-us-west-2.amazonaws.com/coverr/mp4/2-Ways-Traffic.mp4"></video>
~~~~