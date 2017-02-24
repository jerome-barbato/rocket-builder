# Map
   
###### file: js/metabolism/map.js
    
A controller is required and the map must have an height defined

~~~
<div controller="map">
    <div data-map style="height: 500px"></div>
</div>
~~~
~~~
angulight.controller('map', function($dom){

    var $map = $dom.find('[data-map]');
    new MetaMap( $map );
});
~~~

Todo: add full documentation
