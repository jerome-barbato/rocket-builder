/**
 * Map
 *
 * Copyright (c) 2017 - Metabolism
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

(function($){

    googlemap_init = false;

    var Map = function($map, template, config, callback){

        var self = this;

        /* Public */

        self.config = {
            marker : {
                url       : app.asset+'/media/icon/marker@2x.png',
                hover_url : app.asset+'/media/icon/marker--hover@2x.png',
                width     : 45,
                height    : 65,
                label     : true
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
        self.__construct =  function( $map, config, callback )
        {
            if( typeof $.gmap3 == 'undefined' )
            {
                console.warn('gmap3 is required');
                return;
            }

            self.config = $.extend(true, self.config, config);

            var google_api_key = 'google_api' in app ? app.google_api : ('google_key' in app ? app.google_key : '');

            if( !googlemap_init )
            {
                googlemap_init = function(){ $(document).trigger('google.maps.initialized') };

                if( document.readyState == 'complete' )
                {
                    $('head').append('<script src="https://maps.google.com/maps/api/js?key='+google_api_key+'&callback=googlemap_init"></script>');
                }
                else
                {
                    $(window).on('load', function()
                    {
                        $('head').append('<script src="https://maps.google.com/maps/api/js?key='+google_api_key+'&callback=googlemap_init"></script>');
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

            self.context.gmap       = $map.gmap3(self.config.map);
            self.context.map        = $map.gmap3('get');
            self.context.googleMap  = self.context.map.get(0);

            if( !browser.mobile )
            {
                var $loader = $('<div class="meta-map-loader"><div class="valign"><div class="valign__middle">Click to use the map</div></div></div>');

                $map.append($loader, false);
                $loader.click(function () { $loader.hide() });
            }

            google.maps.event.addListener(self.context.map, 'zoom_changed', function() {

                var zoomLevel = self.context.googleMap.getZoom();
                $(document).trigger('meta-map.zoom',[self.context.map, zoomLevel]);
            });

            self.context.init = true;

            if( callback )
                callback(self);
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

                var latLng = new google.maps.LatLng(address.coords.latitude, address.coords.longitude);
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
        self.addMyLocation = function( data, zoom ){

            self.context.gmap.marker({address:data}).then(function(marker){

                self.context.markers.push(marker);

                if( typeof zoom != 'undefined')
                    self.setPosition({coords:{latitude:marker.position.lat(),longitude:marker.position.lng()}}, zoom);
            });
        };



        self.addMarkers = function( markers, fit, icon ){

            var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

            $.each(markers, function(i, marker){

                marker.icon = $.extend({}, self.config.marker, icon ? icon(marker) : {});

                marker.icon_out   = $.extend({}, marker.icon);
                marker.icon_hover = $.extend({}, marker.icon);

                marker.icon_hover.url =  marker.icon.hover_url;

                if( self.config.marker.label )
                    marker.label = {text: labels[i++ % labels.length], color: 'white', fontSize:'12px'};
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

                    self.context.markers = [];
                    self.context.cluster = cluster;
                });
            }
            else{

                self.context.gmap.marker(markers).then(function(markers){

                    self.context.markers = self.context.markers.concat(markers);

                });
            }

            self.context.gmap.on({

                mouseover: function(marker){

                    if( typeof marker == 'undefined')
                        return;

                    marker.setIcon(marker.icon_hover);
                    $(document).trigger('meta-map.over', [self.context.map, marker.index]);
                },
                mouseout: function(marker){

                    if( typeof marker == 'undefined')
                        return;

                    if( !self.context.has_overlay ){

                        marker.setIcon(marker.icon_out);

                        $(document).trigger('meta-map.out', [self.context.map, marker.index]);
                    }
                },
                click: function(marker){

                    if( typeof marker == 'undefined')
                        return;

                    if( self.context.marker )
                        self.context.marker.setIcon(self.context.marker.icon_out);

                    self.context.marker = marker;

                    marker.setIcon(marker.icon_hover);

                    $(document).trigger('meta-map.click', [self.context.map, marker.index]);

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
                                $(document).trigger('meta-map.out', [self.context.map, marker.index]);
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
    if( typeof $.gmap3 != 'undefined' )
        $.gmap3(false);

    rocket = typeof rocket == 'undefined' ? {} : rocket;
    rocket.map = Map;

})(jQuery);
