(function (angular, _){
    "use strict";

    /**
     * @ngdoc module
     *
     * @name mfl.gis_country.controllers
     *
     * @description
     * Contains the controller used in the country view
     */
    angular
    .module("mfl.gis_country.controllers", ["leaflet-directive","nemLogging",
        "mfl.gis.wrapper"])

    /**
     * @ngdoc controller
     *
     * @name mfl.gis.controllers.gis
     *
     * @description
     * Controller for the country view
     */
    .controller("mfl.gis.controllers.gis", ["$scope","leafletData",
        "$http","$stateParams","$state","SERVER_URL",
        "$timeout","leafletMapEvents","gisAdminUnitsApi",
        function ($scope,leafletData,$http, $stateParams,
                  $state, SERVER_URL, $timeout, leafletEvents,
                  gisAdminUnitsApi) {
        $scope.tooltip = {
            "title": "",
            "checked": false
        };
        $scope.spinner = false;
        var bounds = [
            [-4.669618,33.907219],
            [-4.669618,41.90516700000012],
            [4.622499,41.90516700000012],
            [4.622499,33.907219],
            [-4.669618,33.907219]
        ];
        angular.extend($scope, {
            defaults: {
                scrollWheelZoom: false,
                tileLayer: "",
                dragging:true
            },
            events: {
                map: {
                    enable: ["click"],
                    logic: "emit"
                }
            },
            layers:{
                baselayers:{
                    country: {
                        name: "Country",
                        url: "/assets/img/transparent.png",
                        type:"xyz"
                    }
                },
                overlays:{
                    counties:{
                        name:"Counties",
                        type:"group",
                        visible: true
                    }
                }
            }
        });
        gisAdminUnitsApi.getCounties().then(function (data) {
            $scope.markers = _.mapObject(data.geojson.features, function(mark){
                return  {
                        layer: "counties",
                        id:mark.id,
                        lat: mark.properties.center.coordinates[1],
                        lng: mark.properties.center.coordinates[0],
                        label: {
                            message: mark.properties.name,
                            options: {
                                noHide: false
                            }
                        },
                        riseOnHover: true
                    };
            });
            angular.extend($scope, {
                geojson: {
                    data: data.geojson,
                    style: {
                        fillColor: "rgba(255, 255, 255, 0.01)",
                        weight: 2,
                        opacity: 1,
                        color: "rgba(0, 0, 0, 0.52)",
                        dashArray: "3",
                        fillOpacity: 0.7
                    }
                }
            });
        },function(err){
            $scope.alert = err.error;
        });
        leafletData.getMap("countrymap")
            .then(function (map) {
                map.fitBounds(bounds);
                map.spin(true,
                         {lines: 13, length: 20,corners:1,radius:30,width:10});
                $timeout(function() {map.spin(false);}, 1000);
            });
        /*Gets Facilities for heatmap*/
        $scope.filters = {
            "fields" : "geometry"
        };
        gisAdminUnitsApi.getFacCoordinates($scope.filters)
        .then(function (data){
            var heats = data;
            var heatpoints = _.map(heats, function(heat){
                return [
                        heat[2],
                        heat[1]
                    ];
            });
            $scope.layers.overlays.heat = {
                name: "Facilities",
                type: "heat",
                data: heatpoints,
                layerOptions: {
                    radius: 25,
                    opacity:1,
                    blur: 1,
                    gradient: {0.2: "lime", 0.3: "orange",0.4: "red"}
                },
                visible: true
            };
        },
        function(err) {
            $scope.alert = err.error;
        });
        $scope.$on("leafletDirectiveGeoJson.countrymap.click", function(ev, county) {
            $scope.spinner = true;
            $state.go("gis_county",{county_code: county.model.id});
        });
        $scope.$on("leafletDirectiveMarker.countrymap.click", function(ev, county) {
            $scope.spinner = true;
            $state.go("gis_county",{county_code: county.model.id});
        });
    }]);
})(window.angular, window._);
