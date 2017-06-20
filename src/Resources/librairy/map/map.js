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
                url       : app.asset_url+'/media/icon/marker@2x.png',
                hover_url : app.asset_url+'/media/icon/marker--hover@2x.png',
                width     : 45,
                height    : 65,
                label_origin : 'center',
                label: false
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
            },
            cluster : {
                classname: 'map-cluster',
                size: 200,
                x: 0,
                y: 0
            },
            click_to_use : false
        };

        self.context = {
            cluster  : false,
            markers  : [],
            marker   : false,
            selected_marker: false,
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

                self._init($map, callback);
            }
            else{

                $(document).on('google.maps.initialized', function () {

                    self._init($map, callback);
                });
            }
        };



        /**
         *
         */
        self._init = function( $map, callback )
        {
            self.config.map.mapTypeId = google.maps.MapTypeId[self.config.map.mapTypeId];

            self.context.marker = {
                url         : self.config.marker.url,
                scaledSize  : new google.maps.Size(self.config.marker.width, self.config.marker.height),
                anchor      : new google.maps.Point(self.config.marker.width/2, self.config.marker.height),
                labelOrigin : new google.maps.Point(self.config.marker.width/2, self.config.marker.height*0.65)
            };

            if( self.config.marker.label_origin )
            {
                if( self.config.marker.label_origin == 'top' )
                    self.context.marker.labelOrigin = new google.maps.Point(self.config.marker.width/2, -20);
                else if( self.config.marker.label_origin == 'bottom' )
                    self.context.marker.labelOrigin = new google.maps.Point(self.config.marker.width/2, self.config.marker.height+10);
            }

            self.context.$map = $map;

            if( !browser.mobile && self.config.click_to_use )
            {
                var $prevent = $('<div class="map-prevent"><div class="valign"><div class="valign__middle">Click to use the map</div></div></div>');

                $map.append($loader, false);
                $prevent.click(function () { $prevent.fadeOut(300) });
            }

            self.context.gmap = $map.gmap3(self.config.map);

            self.context.gmap.then(function ()
            {
                self.context.map = this.get(0);

                google.maps.event.addListener(self.context.map, 'zoom_changed', function() {

                    var zoomLevel = self.context.map.getZoom();
                    self.context.$map.trigger('map.zoom',[self.context.map, zoomLevel]);
                });

                google.maps.event.addListener(self.context.map, 'bounds_changed', function() {

                    self.context.$map.trigger('map.bounds_changed', [self.context.map]);
                    setTimeout(self.updateLabel, 50);
                });

                google.maps.event.addListener(self.context.map, 'idle', function() {

                    self.context.$map.trigger('map.idle', [self.context.map]);
                    setTimeout(self.updateLabel, 50);
                });


                self.context.init = true;

                if( callback )
                    callback(self);
            });
        };


        self.updateLabel = function()
        {
            $map.find("[style*='custom-label']").addClass('map-label').removeAttr('style');
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
        };



        self.setPosition = function(address, zoom){

            if( typeof address == 'object' ){

                var latLng = new google.maps.LatLng(address.lat, address.lng);
                self.context.map.panTo(latLng);
                self.context.map.setZoom(zoom);
            }
            else{

                self.context.gmap.latlng({address:address})
                    .then(function (result) {

                        var latLng = new google.maps.LatLng(result.lat(), result.lng());
                        self.context.map.panTo(latLng);
                        self.context.map.setZoom(zoom);
                    });
            }
        };



        self.hightlightMarker = function(id, status){

            if( self.context.init && self.context.markers.length > id )
                self.context.markers[id].setIcon( status ? self.context.markers[id].icons.hover : self.context.markers[id].icons.normal);
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

            self.context.gmap.marker(data).then(function(marker){

                self.context.markers.push(marker);

                if( typeof zoom != 'undefined')
                    self.setPosition({lat:marker.position.lat(),lng:marker.position.lng()}, zoom);
            });
        };



        self.addMarkers = function( markers, fit, icon ){

            var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

            $.each(markers, function(i, marker)
            {
                marker.has_overlay = false;
                marker.icon  = $.extend({}, self.context.marker);

                marker.icons = {
                    normal : $.extend({}, marker.icon),
                    hover  : $.extend({}, marker.icon)
                };

                if( icon )
                {
                    var icon_path = icon(marker);

                    marker.icons.normal.url = icon_path.url;
                    marker.icons.hover.url = icon_path.hover_url;
                    marker.icon.url = marker.icons.normal.url;
                }
                else
                {
                    marker.icons.hover.url = self.config.marker.hover_url;
                }

                if( self.config.marker.label )
                    marker.label = {text: labels[i++ % labels.length], color: 'white', fontSize:'12px'};

                if( 'position' in marker && 'address' in marker )
                {
                    marker._address = marker.address;
                    delete marker.address;
                }
            });


            if( 'cluster' in self.config && self.config.cluster )
            {
                self.context.gmap.cluster({
                    size: self.config.cluster.size,
                    markers: markers,
                    cb: function (markers) {
                        if (markers.length > 1) {
                            return {
                                content: '<div class="'+self.config.cluster.classname+'"><span>' + markers.length + '</span></div>',
                                x: self.config.cluster.x,
                                y: self.config.cluster.y
                            };
                        }
                    }

                }).then(function(cluster){

                    self.context.markers = [];
                    self.context.cluster = cluster;
                    setTimeout(self.updateLabel, 50);

                }).on({
                    click: function(marker, clusterOverlay, cluster, event){

                        if (clusterOverlay)
                            clusterOverlay.overlay.getMap().fitBounds(clusterOverlay.overlay.getBounds());
                    }
                });
            }
            else
            {
                self.context.gmap.marker(markers).then(function(markers)
                {
                    self.context.markers = self.context.markers.concat(markers);
                    setTimeout(self.updateLabel, 50);
                });
            }

            self.context.gmap.on({

                mouseover: function(marker){

                    if( typeof marker == 'undefined')
                        return;

                    marker.setIcon(marker.icons.hover);
                    self.context.$map.trigger('marker.over', [self.context.map, marker.index]);
                },
                mouseout: function(marker){

                    if( typeof marker == 'undefined')
                        return;

                    if( !marker.has_overlay )
                    {
                        marker.setIcon(marker.icons.normal);
                        self.context.$map.trigger('marker.out', [self.context.map, marker.index]);
                    }
                },
                click: function(marker){

                    if( typeof marker == 'undefined')
                        return;

                    if( self.context.selected_marker )
                        self.context.selected_marker.setIcon(self.context.selected_marker.icons.normal);

                    self.context.selected_marker = marker;

                    marker.setIcon(marker.icons.hover);

                    self.context.$map.trigger('marker.click', [self.context.map, marker]);

                    var enable = !browser.phone || ('phone' in self.config.overlay && self.config.overlay.phone);
                    enable = enable && (!browser.mobile || ('mobile' in self.config.overlay && self.config.overlay.mobile));
                    enable = enable && (!browser.tablet || ('tablet' in self.config.overlay && self.config.overlay.tablet));

                    if( enable )
                    {
                        self.clearOverlay();

                        marker.has_overlay = true;

                        var html = self.config.overlay.html;

                        html = html.populate(marker);

                        self.context.gmap.overlay({
                            position: marker.getPosition(),
                            content: html,
                            y: self.config.overlay.y,
                            x: self.config.overlay.x

                        }).then(function(overlay) {

                            self.context.overlay = overlay;

                            self.context.$map.trigger('overlay.show', [self.context.map, marker]);

                            overlay.$.find('[data-close]').click(function()
                            {
                                marker.setIcon(marker.icons.normal);
                                self.context.selected_marker = false;

                                self.clearOverlay();
                                marker.has_overlay = false;
                                self.context.$map.trigger('overlay.hide', [self.context.map, marker]);
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
