(function(angular,_){
    "use strict";

    angular.module("mfl.chul.controllers", ["mfl.chul.services",
                                            "mfl.gis.wrapper",
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
        "gisAdminUnitsApi","leafletData","mfl.facility_filter.services.wrappers",
        function ($scope,wrappers,$stateParams,gisApi,leafletData,fac_wrappers) {
            $scope.tooltip = {
                "title": "",
                "checked": false
            };
            $scope.spinner = true;
            wrappers.chul.get($stateParams.unit_id)
            .success(function (data) {
                $scope.spinner = false;
                $scope.unit = data;
                fac_wrappers.facilities.get($scope.unit.facility)
                .success(function (data) {
                    $scope.facilities = data;
                    var f = data;
                    gisApi.wards.get(f.boundaries.ward_boundary)
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

                        /*facility's coordinates*/
                        gisApi.facilities.get(f.coordinates)
                        .success(function(data){
                            angular.extend($scope,{
                                markers: {
                                    mainMarker: {
                                        layer:"facility",
                                        lat: data.properties.coordinates.coordinates[1],
                                        lng: data.properties.coordinates.coordinates[0],
                                        message: "Facility location"
                                    }
                                }
                            });
                        })
                        .error(function(error){
                            console.error(error);
                        });
                    })
                    .error(function(error){
                        console.error(error);
                    });
                })
                .error(function (errors) {
                    $scope.error = errors;
                });
                
            })
            .error(function (error) {
                $scope.spinner = false;
                $scope.alert = error;
            });
        }
    ]);

})(window.angular, window._);
