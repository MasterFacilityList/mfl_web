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
            leafletData.getMap("wardmap")
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
            $scope.ward = gisWard.data;
            angular.extend($scope, {
                    geojson: {
                        data: angular.copy($scope.ward),
                        style: {
                            fillColor: "rgba(194, 255, 183, 0.42)",
                            weight: 2,
                            opacity: 1,
                            color: "white",
                            dashArray: "3",
                            fillOpacity: 0.7
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
                            facilities:{
                                name:"Facilities",
                                type:"markercluster",
                                visible: true
                            }
                        }
                    },
                    selectedWard: {}
                });
            gisFacilitiesApi.api
            .filter($scope.filters_ward)
            .success(function (data){
                var marks = data.results.features;
                $scope.facility_count = marks.length;
                var markers = _.mapObject(marks, function(mark){
                    return  {
                            layer: "facilities",
                            lat: mark.geometry.coordinates[1],
                            lng: mark.geometry.coordinates[0],
                            label: {
                                message: "Facility",
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
        }]);
})(angular);