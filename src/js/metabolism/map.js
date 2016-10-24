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
var UXMap = function(){

    var self = this;

    /* Public */

    self.config = {
        marker : {
            url       : app.asset.medias+'icons/marker@2x.png',
            hover_url : app.asset.medias+'icons/marker--hover@2x.png',
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

    self.context = {
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
    self.init =  function( $map, template, config ) {

        self.config = $.extend(self.config, config);

        self.config.map.mapTypeId = google.maps.MapTypeId[self.config.map.mapTypeId];

        self.config.marker_hover = {
            url         : self.config.marker.hover_url,
            scaledSize  : new google.maps.Size(self.config.marker.width, self.config.marker.height),
            anchor      : new google.maps.Point(self.config.marker.width/2, self.config.marker.height),
            labelOrigin : new google.maps.Point(self.config.marker.width/2, self.config.marker.height*0.65)
        };

        self.config.marker = {
            url         : self.config.marker.url,
            scaledSize  : new google.maps.Size(self.config.marker.width, self.config.marker.height),
            anchor      : new google.maps.Point(self.config.marker.width/2, self.config.marker.height),
            labelOrigin : new google.maps.Point(self.config.marker.width/2, self.config.marker.height*0.65)
        };

        self.config.overlay.html = template;
        self.context.gmap = $map.gmap3(self.config.map);
        self.context.map  = $map.gmap3('get');

        google.maps.event.addListener(self.context.map, 'zoom_changed', function() {
            var zoomLevel = self.context.map.getZoom();
            $(document).trigger('ux-map.zoom',[self.context.map, zoomLevel]);
        });

        self.context.init = true;
    };



    /**
     *
     */
    self.zoomIn = function() {

        if(self.context.map.getZoom() < 21 )
            self.context.map.setZoom( self.context.map.getZoom()+1 );
    };


    /**
     *
     */
    self.zoomOut = function() {

        if(self.context.map.getZoom() >  3)
            self.context.map.setZoom( self.context.map.getZoom()-1 );
    };



    self.clearMarkers = function(){

        $.each(self.context.markers, function(i, marker){

            marker.setMap(null);
            delete self.context.markers[i];
        });

        self.context.markers = [];
    };



    self.clearOverlay = function(){

        if( self.context.overlay )
            self.context.overlay.setMap(null);

        self.context.overlay = false;
        self.context.has_overlay = false;
    };



    self.hightlightMarker = function(id, status){

        if( self.context.init && self.context.markers.length > id )
            self.context.markers[id].setIcon( status ? self.config.marker_hover : self.config.marker);
    };


    /**
     *
     */
    self.reset = function(){

        self.clearMarkers();
    };


    /**
     *
     */
    self.addMyLocation = function( data ){

        self.context.gmap.marker({address:data}).then(function(marker){

            self.context.markers.push(marker);
        });
    };



    self.addMarkers = function( markers, fit ){

        markers = _.values(markers);
        var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        $.each(markers, function(i, marker){

            marker.icon     = self.config.marker;
            marker.label    = {text: labels[i++ % labels.length], color: 'white', fontSize:'12px'}
        });

        self.context.gmap.marker(markers).then(function(markers){

            self.context.markers = self.context.markers.concat(markers);

        }).on({

                mouseover: function(marker){

                    if( self.context.marker )
                        self.context.marker.setIcon(self.config.marker);

                    self.context.marker = marker;

                    marker.setIcon(self.config.marker_hover);
                    $(document).trigger('ux-map.over', [self.context.map, marker.index]);
                },
                mouseout: function(marker){

                    if( !self.context.has_overlay ){

                        marker.setIcon(self.config.marker);
                        $(document).trigger('ux-map.out', [self.context.map, marker.index]);

                        self.context.marker = false;
                    }
                },
                click: function(marker){

                    if( self.context.marker )
                        self.context.marker.setIcon(self.config.marker);

                    self.context.marker = marker;

                    marker.setIcon(self.config.marker_hover);
                    $(document).trigger('ux-map.click', [self.context.map, marker.index]);

                    if( !browser.phone ){

                        self.clearOverlay();

                        self.context.has_overlay = true;

                        var html = self.config.overlay.html;

                        $.each(self.config.overlay.properties, function(i, key) {
                            html = html.split('[[' + key + ']]').join(marker[key]);
                        });

                        self.context.gmap.overlay({
                            position: marker.getPosition(),
                            content: html,
                            y: -70,
                            x: 35

                        }).then(function(overlay) {

                            self.context.overlay = overlay;
                            overlay.$.find('.close').click(function() {

                                marker.setIcon(self.config.marker);
                                self.context.marker = false;

                                self.clearOverlay();
                                $(document).trigger('ux-map.out', [self.context.map, marker.index]);
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
         var gmap = self.context.gmap.gmap3('get');

         gmap.panTo(data.data.latLng);
         gmap.setZoom(gmap.getZoom()+2);
         }
         }
         }*/

        if( fit )
            self.context.gmap.fit();
    };
};


var ux = ux || {};
ux.map = new UXMap();