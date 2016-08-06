/*$(document).on('boot', function(){

    $('.ui-map').each(function(){

        var marker = {
            url: APP.asset.medias.icons+'marker@2x.png',
            scaledSize: new google.maps.Size(45, 65),
            anchor: new google.maps.Point(22, 65),
            labelOrigin: new google.maps.Point(24, 42)
        };

        $(this).gmap3({
            center:[48.8620722, 2.352047],
            zoom:4
        }).marker([
            {address:"8 avenue Lorenzi,Nice, France", icon: marker, label:{text: 'A',color: 'white', fontSize:'12px'}},
            {address:"66000 Perpignan, France", icon: marker, label:{text: 'B',color: 'white', fontSize:'12px'}}
        ])
    });
});*/

/**
 * Map
 *
 * Copyright (c) 2014 - Metabolism
 * Author:
 *   - Jérome Barbato <jerome@metabolism.fr>
 *
 * License: GPL
 * Version: 1.0
 *
 * Requires:
 *   - jQuery
 *
 **/


/**
 *
 */
var UIMap = function(){

    var that = this;

    /* Public */

    that.config = {
        marker : {
            url    : APP.asset.medias.icons+'marker@2x.png',
            width  : 45,
            height : 65
        },
        overlay : {
            selector   : '#distributor',
            properties : ['title', 'distance', 'street', 'phone']
        },
        map : {
            center            :[25,0],
            zoom              : 3,
            maxZoom           : 21,
            minZoom           : 3,
            mapTypeId         : 'ROADMAP',
            mapTypeControl    : true,
            navigationControl : false,
            scrollwheel       : true,
            zoomControl       : true,
            panControl        : false,
            streetViewControl : true,
            styles            : []
        },
        offset      : {21:0.00039, 20:0.00077, 19:0.0015, 18: 0.0031, 17:0.0062, 16:0.0123, 15:0.025, 14:0.05, 13:0.098, 12:0.19 }
    };

    that.context = {
        markers  : [],
        overlays : [],
        map      : false,
        gmap     : false
    };


    /* Contructor. */


    /**
     *
     */
    that.__construct =  function() {
        
        that.config.map.mapTypeId = google.maps.MapTypeId[that.config.map.mapTypeId];

        that.config.marker = {
            url         : that.config.marker.url,
            scaledSize  : new google.maps.Size(that.config.marker.width, that.config.marker.height),
            anchor      : new google.maps.Point(that.config.marker.width/2, that.config.marker.height),
            labelOrigin : new google.maps.Point(that.config.marker.width/2, that.config.marker.height*0.65)
        };

        var $map = $('.ui-map');

        that.config.overlay.html = $(that.config.overlay.selector).html();
        that.context.gmap = $map.gmap3(that.config.map);
        that.context.map  = $map.gmap3('get');
    };



    /**
     *
     */
    that.zoomIn = function() {

        if(that.context.map.getZoom() < 21 )
            that.context.map.setZoom( that.context.map.getZoom()+1 );
    };


    /**
     *
     */
    that.zoomOut = function() {

        if(that.context.map.getZoom() >  3)
            that.context.map.setZoom( that.context.map.getZoom()-1 );
    };


    that.addZoomListener = function ( callback ){

        google.maps.event.addListener(that.context.map, 'zoom_changed', function() {
            var zoomLevel = that.context.map.getZoom();
            callback(zoomLevel);
        });

    };


    that.clearMarkers = function(){

        $.each(that.context.markers, function(i, marker){

            marker.setMap(null);
        });
    };


    /**
     *
     */
    that.addMarkers = function( markers, fit ){

        var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        $.each(markers, function(i, marker){

            marker.id       = i;
            marker.street   = marker.address;
            marker.distance = 0;
            marker.icon     = that.config.marker;
            marker.label    = {text: labels[i++ % labels.length], color: 'white', fontSize:'12px'}
        });

        that.clearMarkers();

        that.context.gmap.marker(markers).then(function(markers){

            that.context.markers = markers;

        }).on({

                mouseover: function(marker){


                },
                mouseout: function(marker){

                },
                click: function(marker){

                    if( that.context.overlay )
                        that.context.overlay.setMap(null);

                    var html = that.config.overlay.html;

                    $.each(that.config.overlay.properties, function(i, key){
                        html = html.split('[['+key+']]').join(marker[key]);
                    });

                    that.context.gmap.overlay({
                        position : marker.getPosition(),
                        content  : html,
                        y        : -95,
                        x        : 30

                    }).then(function(overlay){

                        that.context.overlay = overlay;

                        overlay.$.find('.close').click(function(){
                            that.context.overlay.setMap(null);
                        });
                    });
                }
            });

        /*,
         cluster:{
         radius: 15,
         3: {
         content: "<div class='cluster'></div>",
         width: 20,
         height: 30
         },
         events: {
         click:function(cluster, event, data) {
         var gmap = that.context.gmap.gmap3('get');

         gmap.panTo(data.data.latLng);
         gmap.setZoom(gmap.getZoom()+2);
         }
         }
         }*/

        if( fit )
            that.context.gmap.fit({maxZoom: 16});
    };


    $(document).on('boot', that.__construct);
};


var ui = ui || {};
ui.map = new UIMap();