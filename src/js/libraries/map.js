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
            url       : APP.asset.medias.icons+'marker@2x.png',
            hover_url : APP.asset.medias.icons+'marker--hover@2x.png',
            width  : 45,
            height : 65
        },
        overlay : {
            properties : []
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
        }
    };

    that.context = {
        init     : false,
        markers  : [],
        marker   : false,
        overlays : [],
        map      : false,
        gmap     : false
    };


    /* Contructor. */


    /**
     *
     */
    that.init =  function( $map, template, config ) {

        that.config = $.extend(that.config, config);

        that.config.map.mapTypeId = google.maps.MapTypeId[that.config.map.mapTypeId];

        that.config.marker_hover = {
            url         : that.config.marker.hover_url,
            scaledSize  : new google.maps.Size(that.config.marker.width, that.config.marker.height),
            anchor      : new google.maps.Point(that.config.marker.width/2, that.config.marker.height),
            labelOrigin : new google.maps.Point(that.config.marker.width/2, that.config.marker.height*0.65)
        };

        that.config.marker = {
            url         : that.config.marker.url,
            scaledSize  : new google.maps.Size(that.config.marker.width, that.config.marker.height),
            anchor      : new google.maps.Point(that.config.marker.width/2, that.config.marker.height),
            labelOrigin : new google.maps.Point(that.config.marker.width/2, that.config.marker.height*0.65)
        };

        that.config.overlay.html = template;
        that.context.gmap = $map.gmap3(that.config.map);
        that.context.map  = $map.gmap3('get');

        google.maps.event.addListener(that.context.map, 'zoom_changed', function() {
            var zoomLevel = that.context.map.getZoom();
            $(document).trigger('ui-map.zoom',[that.context.map, zoomLevel]);
        });

        that.context.init = true;
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



    that.clearMarkers = function(){

        $.each(that.context.markers, function(i, marker){

            marker.setMap(null);
        });
    };



    that.clearOverlay = function(){

        if( that.context.overlay )
            that.context.overlay.setMap(null);

        that.context.overlay = false;
        that.context.has_overlay = false;
    };



    that.hightlightMarker = function(id, status){

        if( that.context.init )
            that.context.markers[id].setIcon( status ? that.config.marker_hover : that.config.marker);
    };


    /**
     *
     */
    that.reset = function(){

        that.clearMarkers();
    };


    /**
     *
     */
    that.addMyLocation = function( data ){

        that.context.gmap.marker({address:data}).then(function(marker){

            that.context.markers.push(marker);
        });
    };



    that.addMarkers = function( markers, fit ){

        var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        $.each(markers, function(i, marker){

            marker.icon     = that.config.marker;
            marker.label    = {text: labels[i++ % labels.length], color: 'white', fontSize:'12px'}
        });

        that.context.gmap.marker(markers).then(function(markers){

            that.context.markers = markers;

        }).on({

                mouseover: function(marker){

                    if( that.context.marker )
                        that.context.marker.setIcon(that.config.marker);

                    that.context.marker = marker;

                    marker.setIcon(that.config.marker_hover);
                    $(document).trigger('ui-map.over', [that.context.map, marker.index]);
                },
                mouseout: function(marker){

                    if( !that.context.has_overlay ){

                        marker.setIcon(that.config.marker);
                        $(document).trigger('ui-map.out', [that.context.map, marker.index]);

                        that.context.marker = false;
                    }
                },
                click: function(marker){

                    if( that.context.marker )
                        that.context.marker.setIcon(that.config.marker);

                    that.context.marker = marker;

                    marker.setIcon(that.config.marker_hover);
                    $(document).trigger('ui-map.click', [that.context.map, marker.index]);

                    if( !browser.phone ){

                        that.clearOverlay();

                        that.context.has_overlay = true;

                        var html = that.config.overlay.html;

                        $.each(that.config.overlay.properties, function (i, key) {
                            html = html.split('[[' + key + ']]').join(marker[key]);
                        });

                        that.context.gmap.overlay({
                            position: marker.getPosition(),
                            content: html,
                            y: -70,
                            x: 35

                        }).then(function (overlay) {

                            that.context.overlay = overlay;
                            overlay.$.find('.close').click(function () {

                                marker.setIcon(that.config.marker);
                                that.context.marker = false;

                                that.clearOverlay();
                                $(document).trigger('ui-map.out', [that.context.map, marker.id]);
                            });
                        });
                    }
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
            that.context.gmap.fit();
    };
};


var ui = ui || {};
ui.map = new UIMap();