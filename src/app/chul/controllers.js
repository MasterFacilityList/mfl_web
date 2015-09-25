(function(angular,_){
    "use strict";

    angular.module("mfl.chul.controllers", ["mfl.chul.services",
                                            "mfl.facility_filter.services"])

    .controller("mfl.chul.controllers.list", ["$scope","mfl.chul.services.wrappers",
        function ($scope,wrappers) {
            $scope.tooltip = {
                "title": "",
                "checked": false
            };
            $scope.spinner = true;
            wrappers.chul.list()
            .success(function (data) {
                $scope.spinner = false;
                $scope.results = data;
            })
            .error(function (error) {
                $scope.spinner = false;
                $scope.alert = error;
            });
        }
    ])
    .controller("mfl.chul.controllers.view", ["$scope","mfl.chul.services.wrappers","$stateParams",
        "gisAdminUnitsApi","leafletData",
        function ($scope,wrappers,$stateParams,gisAdminUnitsApi,leafletData) {
            $scope.tooltip = {
                "title": "",
                "checked": false
            };
            $scope.spinner = true;
            /*Setup for map data*/
            angular.extend($scope, {
                defaults: {
                    scrollWheelZoom: false
                },
                layers:{},
                tiles:{
                    openstreetmap: {
                        url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                        options: {
                            opacity: 0.7,
                            attribution: "&copy; <a href='http://www.openstreetmap.org/"+
                            "copyright'>OpenStreetMap</a> contributors"
                        }
                    }
                }
            });
            wrappers.chul.get($stateParams.unit_id)
            .success(function (unit) {
                $scope.spinner = false;
                $scope.unit = unit;
                /*ward coordinates*/
                gisAdminUnitsApi.wards.get(unit.boundaries.ward_boundary)
                .success(function(data){
                    $scope.spinner = false;
                    $scope.ward_gis = data;
                    leafletData.getMap("wardmap")
                        .then(function (map) {
                            var coords = data.properties.bound.coordinates[0];
                            var bounds = _.map(coords, function(c) {
                                return [c[1], c[0]];
                            });
                            map.fitBounds(bounds);
                        });
                    var gis = data;
                    angular.extend($scope, {
                        markers: {
                            mainMarker: {
                                layer:"facility",
                                lat: unit.geo_features.geometry.coordinates[1],
                                lng: unit.geo_features.geometry.coordinates[0],
                                message: "Facility location"
                            }
                        },
                        geojson: {
                            data: gis,
                            style: {
                                fillColor: "rgb(255, 135, 32)",
                                weight: 2,
                                opacity: 1,
                                color: "rgba(0, 0, 0, 0.52)",
                                dashArray: "3",
                                fillOpacity: 0.8
                            }
                        },
                        layers:{
                            baselayers:{
                                ward: {
                                    name: "Ward",
                                    url: "/assets/img/transparent.png",
                                    type:"group"
                                }
                            },
                            overlays:{
                                facility:{
                                    name:"Facility Location",
                                    type:"group",
                                    visible: true
                                }
                            }
                        }
                    });
                })
                .error(function(error){
                    console.error(error);
                });
            })
            .error(function (error) {
                $scope.spinner = false;
                $scope.alert = error;
            });
        }
    ]);

})(window.angular,window._);
