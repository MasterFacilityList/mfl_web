(function (angular, _){
    "use strict";

    angular.module("mfl.gis_ward.controllers", [
        "leaflet-directive",
        "mfl.gis.wrapper"
    ])

    .controller("mfl.gis.controllers.gis_ward", ["$scope","leafletData",
        "$http","$state","$stateParams","SERVER_URL",
        "$timeout","gisAdminUnitsApi",
        function ($scope, leafletData,$http, $state, $stateParams,
                   SERVER_URL,$timeout,gisAdminUnitsApi) {
        $scope.county_id = $stateParams.county_id;
        gisAdminUnitsApi.counties.get($scope.county_id)
        .success(function (county_data) {
            $scope.county = county_data;
        })
        .error(function (error) {
            console.log(error);
        });
        $scope.const_id = $stateParams.const_id;
        gisAdminUnitsApi.constituencies.get($scope.const_id)
        .success(function (const_data) {
            $scope.constituency = const_data;
        })
        .error(function (error) {
            console.log(error);
        });
        $scope.const_boundaries = $stateParams.const_boundaries;
        $scope.ward_boundaries = $stateParams.ward_boundaries;
        $scope.ward_id = $stateParams.ward_id;
        $scope.tooltip = {
            "title": "",
            "checked": false
        };
        gisAdminUnitsApi.wards.get($scope.ward_id)
        .success(function (ward_data) {
            $scope.ward = ward_data;
            angular.extend($scope, {
                defaults: {
                    scrollWheelZoom: false,
                    tileLayer: "",
                    dragging:true
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
                var coords = ward_data.properties.bound.coordinates[0];
                var bounds = _.map(coords, function(c) {
                    return [c[1], c[0]];
                });
                map.fitBounds(bounds);
                map.spin(true,  {lines: 13, length: 20,corners:1,radius:30,width:10});
                $timeout(function() {map.spin(false);}, 1000);
            });

            $scope.filters_ward = {
                ward : ward_data.properties.ward_id
            };
            $scope.ward = ward_data;
            angular.extend($scope, {
                    geojson: {
                        data: angular.copy($scope.ward),
                        style: {
                            fillColor: "rgba(236, 255, 183, 0.14)",
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
                                type:"group",
                                visible: true
                            }
                        }
                    },
                    selectedWard: {}
                });
            var marks = ward_data.properties.facility_coordinates;
            $scope.facility_count = marks.length;
            var markers = _.mapObject(marks, function(mark){
                return  {
                        layer: "facilities",
                        lat: mark.geometry.coordinates[1],
                        lng: mark.geometry.coordinates[0],
                        label: {
                            message: mark.name,
                            options: {
                                noHide: true
                            }
                        },
                        riseOnHover: true
                    };
            });
            $scope.markers = markers;
        })
        .error(function (error) {
            console.log(error);
        });
    }]);
})(window.angular, window._);
