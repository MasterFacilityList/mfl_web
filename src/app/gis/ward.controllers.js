(function(angular){
    "use strict";
    angular
        .module("mfl.gis_ward.controllers", ["leaflet-directive",
            "mfl.gis.wrapper"])
        .controller("mfl.gis.controllers.gis_ward", ["$scope","leafletData",
            "$http","$state","$stateParams","SERVER_URL","gisWardsApi",
            "gisWard","$timeout","gisFacilitiesApi",
            function ($scope, leafletData,$http, $state, $stateParams,
                       SERVER_URL, gisWardsApi, gisWard,$timeout,gisFacilitiesApi) {
            $scope.tooltip = {
                "title": "",
                "checked": false
            };
            $scope.ward = gisWard.data;
            $scope.title = [
                {
                    icon: "fa-map-marker",
                    name: "Ward"
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
            leafletData.getMap()
                .then(function (map) {
                var coords = gisWard.data.properties.bound.coordinates[0];
                var bounds = _.map(coords, function(c) {
                    return [c[1], c[0]];
                });
                map.fitBounds(bounds);
                map.spin(true,  {lines: 13, length: 20,corners:1,radius:30,width:10});
                $timeout(function() {map.spin(false);}, 1000);
            });
                
            $scope.filters_ward = {
                ward : gisWard.data.properties.ward_id
            };
            gisFacilitiesApi.api
            .filter($scope.filters_ward)
            .success(function (data){
                var marks = data.results.features;
                var markers = _.mapObject(marks, function(mark){
                    return  {
                            group: "facilities",
                            lat: mark.geometry.coordinates[1],
                            lng: mark.geometry.coordinates[0],
                            label: {
                                message: ""+mark.properties.facility_name+"",
                                options: {
                                    noHide: true
                                }
                            }
                        };
                });
                $scope.markers = markers;
            })
            .error(function (e){
                $scope.alert = e.error;
            });
            $scope.ward = gisWard.data;
            angular.extend($scope, {
                    geojson: {
                        data: angular.copy($scope.ward),
                        style: {
                            fillColor: "rgba(24, 246, 255, 0.59)",
                            weight: 2,
                            opacity: 1,
                            color: "white",
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
                            facilities:{
                                name:"Facilities",
                                type:"markercluster",
                                visible: true
                            }
                        }
                    },
                    selectedWard: {}
                });
        }]);
})(angular);