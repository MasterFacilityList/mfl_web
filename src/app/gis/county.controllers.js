(function (angular, _){
    "use strict";

    /**
     * @ngdoc module
     *
     * @name mfl.gis_county.controllers
     *
     * @description
     * Contains controller used in the county view
     */
    angular
    .module("mfl.gis_county.controllers", ["leaflet-directive","nemLogging",
        "mfl.gis.wrapper"])

    /**
     * @ngdoc controller
     *
     * @name mfl.gis.controllers.gis_county
     *
     * @description
     * Controller for the county view
     */
    .controller("mfl.gis.controllers.gis_county", ["$scope","leafletData",
        "$http","$state","$stateParams", "$timeout",
        "SERVER_URL","gisAdminUnitsApi",
        function ($scope, leafletData, $http, $state,
                   $stateParams, $timeout,
                   SERVER_URL,gisAdminUnitsApi) {
        $scope.county_code = $stateParams.county_code;
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
                overlays:{
                    constituencies:{
                        name:"Constituencies",
                        type:"group",
                        visible: true
                    }
                }
            }
        });
        //Get County Data
        gisAdminUnitsApi.county.get($scope.county_code)
        .success(function (county_data){
            $scope.county = county_data;
            $scope.spinner = false;
            leafletData.getMap("countymap")
                .then(function (map) {
                    var coords = county_data.meta.bound.coordinates[0];
                    var bounds = _.map(coords, function(c) {
                        return [c[1], c[0]];
                    });
                    map.fitBounds(bounds);
                    map.spin(true,
                        {lines: 13, length: 20,corners:1,radius:30,width:10});
                    $timeout(function() {map.spin(false);}, 500);
                });

            //Get Facility Coordinates
            gisAdminUnitsApi.getFacCoordinates()
            .then(function (data){
                var heats = _.filter(data,{3:$scope.county_code});
                $scope.facility_count = heats.length;
                var heatpoints = _.map(heats, function(heat){
                    return [
                            heat[2],
                            heat[1]
                        ];
                });
                var county_marks = county_data.geojson.features;
                var markers = _.mapObject(county_marks, function(mark){
                    return {
                            layer:"constituencies",
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
                        data: county_data.geojson,
                        style: {
                            fillColor: "rgba(255, 255, 255, 0.27)",
                            weight: 2,
                            opacity: 1,
                            color: "rgba(0, 0, 0, 0.52)",
                            dashArray: "3",
                            fillOpacity: 0.7
                        }
                    },
                    layers:{
                        baselayers:{
                            googleRoadmap: {
                                name: "Google Streets",
                                layerType: "ROADMAP",
                                type: "google",
                                layerOptions: {
                                    opacity: 0.35
                                }
                            }
                        },
                        overlays:{
                            constituencies:{
                                name:"Constituencies",
                                type:"group",
                                visible: true
                            },
                            heat:{
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
                            }
                        },
                        selectedConst: {}
                    },
                    markers: markers
                });
            },function(err) {
                $scope.alert = err.error;
            });

            $scope.$on("leafletDirectiveGeoJson.countymap.click", function(ev, constituency) {
                $scope.spinner = true;
                $state.go("gis_county.gis_const",{county_code:$stateParams.county_code,
                                        constituency_code: constituency.model.id});
            });
            $scope.$on("leafletDirectiveMarker.countymap.click", function(ev, constituency) {
                $scope.spinner = true;
                $state.go("gis_county.gis_const",{county_code:$stateParams.county_code,
                                        constituency_code: constituency.model.id});
            });

        })
        .error(function (err) {
            $scope.alert = err.error;
        });
    }]);
})(window.angular, window._);
