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
var UXMapInit = false;

var UXMap = function($map, template, config, callback){

    var self = this;

    /* Public */

    self.config = {
        marker : {
            url       : app.asset+'/media/icon/marker@2x.png',
            hover_url : app.asset+'/media/icon/marker--hover@2x.png',
            width     : 45,
            height    : 65,
            label_origin : 'center'
        },
        overlay : {
            html       : '',
            x          : 0,
            y          : 0
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
        cluster  : false,
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
    self.__construct =  function( $map, config, callback ) {

        self.config = $.extend(true, self.config, config);

        if( !UXMapInit ){

            UXMapInit = function(){ $(document).trigger('google.maps.initialized') };

            if( document.readyState == 'complete' ){

                $('head').append('<script src="https://maps.google.com/maps/api/js?key='+('google_key' in app ? app.google_key : '')+'&callback=UXMapInit&libraries=geometry"></script>');
            }
            else{

                $(window).load(function(){

                    $('head').append('<script src="https://maps.google.com/maps/api/js?key='+('google_key' in app ? app.google_key : '')+'&callback=UXMapInit&libraries=geometry"></script>');
                });
            }

        }

        if( typeof google != 'undefined' && 'maps' in google ){

            self.init($map, callback);
        }
        else{

            $(document).on('google.maps.initialized', function () {

                self.init($map, callback);
            });
        }
    };



    /**
     *
     */
    self.init = function( $map, callback ) {

        self.config.map.mapTypeId = google.maps.MapTypeId[self.config.map.mapTypeId];

        self.config.marker.scaledSize = new google.maps.Size(self.config.marker.width, self.config.marker.height);
        self.config.marker.anchor = new google.maps.Point(self.config.marker.width/2, self.config.marker.height);

        if( self.config.marker.label_origin ){

            if( self.config.marker.label_origin == 'top' )
                self.config.marker.labelOrigin = new google.maps.Point(self.config.marker.width/2, -20);
            else if( self.config.marker.label_origin == 'bottom' )
                self.config.marker.labelOrigin = new google.maps.Point(self.config.marker.width/2, self.config.marker.height+10);
        }

        self.context.gmap       = $map.gmap3(self.config.map);
        self.context.map        = $map.gmap3('get');
        self.context.googleMap  = self.context.map.get(0);

        if( !browser.mobile )
        {
            var $loader = $('<div class="ux-map-loader"><div class="valign"><div class="valign__middle">Click to use the map</div></div></div>');

            $map.append($loader, false);
            $loader.click(function () { $loader.hide() });
        }

        google.maps.event.addListener(self.context.googleMap, 'zoom_changed', function() {

            var zoomLevel = self.context.googleMap.getZoom();
            $map.trigger('ux-map.zoom',[self.context.map, zoomLevel]);
        });

        google.maps.event.addListener(self.context.googleMap, 'bounds_changed', function() {

            $map.trigger('ux-map.change');
            setTimeout(self.updateLabel, 50);
        });

        google.maps.event.addListener(self.context.googleMap, 'idle', function() {

            $map.trigger('ux-map.idle');
            setTimeout(self.updateLabel, 50);
        });

        self.context.init = true;

        if( callback )
            callback(self);
    };


    self.updateLabel = function(){

        $map.find("[style*='custom-label']").addClass('ux-map-label').removeAttr('style');
    };


    /**
     *
     */
    self.zoomIn = function() {

        if(self.context.googleMap.getZoom() < 21 )
            self.context.googleMap.setZoom( self.context.googleMap.getZoom()+1 );
    };


    /**
     *
     */
    self.zoomOut = function() {

        if(self.context.googleMap.getZoom() >  3)
            self.context.googleMap.setZoom( self.context.googleMap.getZoom()-1 );
    };



    self.clearMarkers = function(){

        if( self.context.cluster ){

            var markers = self.context.cluster.markers();
            $.each(markers, function(i, marker){

                self.context.cluster.remove(marker);
            });

            self.context.cluster = false;
        }
        else{

            $.each(self.context.markers, function(i, marker){

                marker.setMap(null);
                delete self.context.markers[i];
            });

            self.context.markers = [];
        }
    };



    self.clearOverlay = function(){

        if( self.context.overlay )
            self.context.overlay.setMap(null);

        self.context.overlay = false;
        self.context.has_overlay = false;
    };



    self.setPosition = function(address, zoom){

        if( typeof address == 'object' ){

            var latLng = new google.maps.LatLng(address.lat, address.lng);
            self.context.googleMap.panTo(latLng);
            self.context.googleMap.setZoom(zoom);
        }
        else{

            self.context.gmap.latlng({address:address})
                .then(function (result) {

                    var latLng = new google.maps.LatLng(result.lat(), result.lng());
                    self.context.googleMap.panTo(latLng);
                    self.context.googleMap.setZoom(zoom);
                });
        }
    };



    self.hightlightMarker = function(id, status){

        if( self.context.init && self.context.markers.length > id )
            self.context.markers[id].setIcon( status ? self.context.markers[id].marker_hover : self.context.markers[id].marker);
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


    /**
     *
     */
    self.findClosestMarkers = function( limit, latLng )
    {
        var markers = [];

        if( typeof latLng == 'undefined')
            latLng = self.context.googleMap.getCenter();

        if( typeof limit == 'undefined')
            limit = 10;

        for( var i=0;i<self.context.markers.length; i++ )
        {
            var marker_latLng = new google.maps.LatLng(self.context.markers[i].position[0], self.context.markers[i].position[1]);
            self.context.markers[i].distance = google.maps.geometry.spherical.computeDistanceBetween(marker_latLng, latLng);
        }

        self.context.markers.sort(function(a, b) { return a.distance - b.distance });

        if( self.context.markers.length )
        {
            markers = self.context.markers.slice(0, limit);
        }

        return markers;
    };


    self.addMarkers = function( markers, fit, cb ){

        $.each(markers, function(i, marker){

            marker.icon = $.extend({}, self.config.marker);

            if( cb ){

                marker = cb(marker);

                if( typeof marker.label == 'string' )
                    marker.label = { text: marker.label, fontFamily: 'custom-label' }
            }

            marker.icon_out   = $.extend({}, marker.icon);
            marker.icon_hover = $.extend({}, marker.icon);

            marker.icon_hover.url =  marker.icon.hover_url;
        });


        if( 'cluster' in self.config ) {

            self.context.gmap.cluster({
                size: self.config.cluster.size,
                markers: markers,
                cb: function (markers) {
                    if (markers.length > 1) {
                        return {
                            content: '<div class="'+self.config.cluster.class+'"><span>' + markers.length + '</span></div>',
                            x: self.config.cluster.x,
                            y: self.config.cluster.y
                        };
                    }
                }

            }).then(function(cluster){

                self.context.cluster = cluster;
                self.context.markers = self.context.markers.concat(markers);
                setTimeout(self.updateLabel, 50);

            }).on({
                click: function(marker, clusterOverlay, cluster, event){

                    if (clusterOverlay)
                        clusterOverlay.overlay.getMap().fitBounds(clusterOverlay.overlay.getBounds());
                }
            });
        }
        else{

            self.context.gmap.marker(markers).then(function(){

                self.context.markers = self.context.markers.concat(markers);
                setTimeout(self.updateLabel, 50);
            });
        }

        self.context.gmap.on({

            mouseover: function(marker){

                if( typeof marker == 'undefined')
                    return;

                marker.setIcon(marker.icon_hover);
                $(document).trigger('ux-map.over', [self.context.map, marker.index]);
            },
            mouseout: function(marker){

                if( typeof marker == 'undefined')
                    return;

                if( !self.context.has_overlay ){

                    marker.setIcon(marker.icon_out);

                    $(document).trigger('ux-map.out', [self.context.map, marker.index]);
                }
            },
            click: function(marker){

                if( typeof marker == 'undefined')
                    return;

                if( self.context.marker )
                    self.context.marker.setIcon(self.context.marker.icon_out);

                self.context.marker = marker;

                marker.setIcon(marker.icon_hover);

                $(document).trigger('ux-map.click', [self.context.map, marker.index]);

                if( !browser.phone || ('phone' in self.config.overlay && self.config.overlay.phone) ){

                    self.clearOverlay();

                    self.context.has_overlay = true;

                    var html = self.config.overlay.html;

                    html = html.populate(marker);

                    self.context.gmap.overlay({
                        position: marker.getPosition(),
                        content: html,
                        y: self.config.overlay.y,
                        x: self.config.overlay.x

                    }).then(function(overlay) {

                        self.context.overlay = overlay;
                        overlay.$.find('[data-close]').click(function() {

                            marker.setIcon(marker.icon_out);
                            self.context.marker = false;

                            self.clearOverlay();
                            $(document).trigger('ux-map.out', [self.context.map, marker.index]);
                        });
                    });
                }
            }
        });

        /**/

        if( fit )
            self.context.gmap.fit();
    };

    self.__construct( $map, template, config, callback );
};


// disable gmap3 lib autoload
$.gmap3(false);
