(function(angular){
    "use strict";
    angular
    .module("mfl.gis_country.controllers", ["leaflet-directive",
        "mfl.gis.wrapper"])
    .controller("mfl.gis.controllers.gis", ["$scope","leafletData","gisCountriesApi",
        "$http","$stateParams","$state","SERVER_URL","gisCountiesApi","gisFacilitiesApi",
        "$timeout",
        function ($scope,leafletData,gisCountriesApi,$http, $stateParams,
                   $state,SERVER_URL, gisCountiesApi, gisFacilitiesApi,$timeout) {
        $scope.tooltip = {
            "title": "",
            "checked": false
        };
        $scope.title = [
            {
                icon: "fa-map-marker",
                name: "Geographic Discovery"
            }
        ];
        $scope.action = [
            {
                func : "onclick=window.history.back()",
                class: "action-btn action-btn-primary action-btn-md",
                color: "blue",
                tipmsg: "Go back",
                icon: "fa-arrow-left"
            }
        ];
        angular.extend($scope, {
            defaults: {
                scrollWheelZoom: false,
                tileLayer: ""
            },
            events: {
                map: {
                    enable: ["moveend", "popupopen"],
                    logic: "emit"
                },
                marker: {
                    enable: [],
                    logic: "emit"
                }
            },
            markers:{},
            layers:{}
        });
        $scope.filters_country = {
            code: "KEN"
        };
        $scope.country_success = function (data){
            leafletData.getMap()
                .then(function (map) {
                    var coords = data.results.features[0].properties.bound.coordinates[0];
                    var bounds = _.map(coords, function(c) {
                        return [c[1], c[0]];
                    });
                    map.fitBounds(bounds);
                    map.spin(true,
                             {lines: 13, length: 20,corners:1,radius:30,width:10});
                    $timeout(function() {map.spin(false);}, 1000);
                });
        };
        gisCountriesApi.api
        .filter($scope.filters_country)
        .success($scope.country_success)
        .error(function () {});
        $scope.filters_counties = {
            page_size: 47
        };
        gisCountiesApi.api
        .filter($scope.filters_counties)
        .success(function (data){
            var marks = data.results.features;
            var markers = _.mapObject(marks, function(mark){
                return  {
                        layer: "counties",
                        lat: mark.properties.center.coordinates[1],
                        lng: mark.properties.center.coordinates[0],
                        label: {
                            message: ""+mark.properties.name+"",
                            options: {
                                noHide: true
                            }
                        }
                    };
            });
            $scope.markers = markers;
            angular.extend($scope, {
                geojson: {
                    data: data.results,
                    style: {
                        fillColor: "rgba(255, 255, 255, 0.01)",
                        weight: 2,
                        opacity: 1,
                        color: "rgba(0, 0, 0, 0.52)",
                        dashArray: "3",
                        fillOpacity: 0.7
                    }
                },
                layers:{
                    baselayers:{
                        mapbox_light: {
                            name: "Mapbox Light",
                            url: "http://api.tiles.mapbox.com/"+
                            "v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}",
                            type: "xyz",
                            layerOptions: {
                                apikey: "pk.eyJ1IjoiYnVmYW"+
                                "51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q",
                                mapid: "jasonwanjohi.m706od7c"
                            }
                        }
                    },
                    overlays:{
                        counties:{
                            name:"Counties",
                            type:"markercluster",
                            visible: true
                        },
                        heat: {
                            name: "Facilities",
                            type: "heat",
                            data: angular.copy($scope.heatpoints),
                            layerOptions: {
                                radius: 5,
                                blur: 1
                            },
                            visible: true
                        }
                    }
                },
                selectedConst: {}
            });
        })
        .error(function(err){
            /*TODO Error handling*/
            console.log(err);
        });

        $scope.filters_fac = {
            page_size:9000
        };
        gisFacilitiesApi.api
        .filter($scope.filters_fac)
        .success(function (data){
            var heats = data.results.features;
            var heatpoints = _.map(heats, function(heat){
                return [
                        heat.geometry.coordinates[1],
                        heat.geometry.coordinates[0]
                    ];
            });
            $scope.heatpoints = heatpoints;
            $scope.layers.overlays = {
                heat: {
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
            };
        })
        .error(function(err){
            console.log(err);
        });
        $scope.$on("leafletDirectiveMap.geojsonMouseover", function(ev, county) {
            $scope.hoveredCounty = county;
        });
        $scope.$on("leafletDirectiveMap.geojsonClick", function(ev, county) {
            var boundary_ids = county.properties.constituency_boundary_ids.join(",");
            $stateParams.const_boundaries = boundary_ids;
            $state.go("gis_county",{county_id: county.id,
                                    const_boundaries : boundary_ids});
        });
    }]);
})(angular);