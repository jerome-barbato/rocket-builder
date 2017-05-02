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


### API

#### Events

trigger events on jQuery map object

- map.zoom [map, zoomLevel]
- map.bounds_changed [map]
- map.idle  [map]
- marker.over [map, marker]
- marker.out [map, marker]
- marker.click [map, marker]
- overlay.show [map, marker]
- overlay.hide [map, marker]

Google map options documentation : https://developers.google.com/maps/documentation/javascript/controls#ControlOptions


#### Functions

- zoomIn
- zoomOut
- clearMarkers
- clearOverlay
- setPosition [address, zoom]
- addMyLocation [data, zoom]
- addMarkers [markers, fit, icon]
- updateLabel


#### Example with custom map style and one marker without GPS

~~~
angulight.controller('map', function($dom)
{
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
~~~

#### Example with multiple marker

~~~
angulight.controller('map', function($dom)
{
    var config = {
           marker : {
               width  : 28,
               height : 38,
               url: app.asset + '/media/icon/marker@2x.png',
               hover_url: app.asset + '/media/icon/marker--hover@2x.png',
           },
           overlay : {
               html : '<div>[[name]]</div>'
           }
       };
       
    var poi = [
        {
            "name": "John Smith Store",
            "address": "20, Main Street<br/>8070 Bertrange<br/>Luxembourg",
            "position": [ 49.608032, 6.099541],
        },
        {
             "name": "Jane Store",
             "address": "30, Second Street<br/>8070 Bertrange<br/>Luxembourg",
             "position": [ 46.608032, 7.099541],
        }
     ]  

    new rocket.map( $dom.find('[data-map]'), config, function(map)
    {
        // poi array, autofit
        map.addMarkers(stores, true);
    });
});
~~~
