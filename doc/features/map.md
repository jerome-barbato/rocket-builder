# Map
   
###### files: js/metabolism/map.js, js/vendor/gmap3.js
    
A controller is required and the map must have an height defined, Gmap3 is required.

Add Google api key ( google_key ) to window.app in layout.html.twig

~~~
<script type="text/javascript">
    window.app = {
        debug : {{ debug|default('0') }}
        ...
        google_key : 'lkjdsmoipvutv4654vtrteqlijoiqr'
    };
</script>
~~~

Add HTML Markup

~~~
<div controller="map">
    <div data-map style="height: 500px"></div>
</div>
~~~

Create a controller

~~~
angulight.controller('map', function($dom){

    var $map = $dom.find('[data-map]');
    new rocket.map( $map );
});
~~~

### Example with custom map style and one marker

Google map options documentation : https://developers.google.com/maps/documentation/javascript/controls#ControlOptions

~~~
angulight.controller('map', function($dom){

    var snazzy_map = [{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}];

    var config = {
        map : {
            streetViewControl : false,
            mapTypeControl    : false,
            zoomControl       : true,
            scrollwheel       : true,
            styles            : snazzy_map
        }
    };

    new rocket.map( $dom.find('[data-map]'), config, function(map){

        // {address, icon}, zoom
        map.addMyLocation({address:'Nice', icon: 'http://maps.google.com/mapfiles/marker_green.png'}, 5);
    });
});
