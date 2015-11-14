(function (angular, _){
    "use strict";


    /**
     * @ngdoc module
     *
     * @name mfl.gis_ward.controllers
     *
     * @description
     * Contains all the controller used in the ward view
     */
    angular.module("mfl.gis_ward.controllers", [
        "leaflet-directive",
        "nemLogging",
        "mfl.gis.wrapper"
    ])

    /**
     * @ngdoc controller
     *
     * @name mfl.gis.controllers.gis_ward
     *
     * @description
     * Controller for the ward view
     */
    .controller("mfl.gis.controllers.gis_ward", ["$scope","leafletData",
        "$http","$state","$stateParams","SERVER_URL",
        "$timeout","gisAdminUnitsApi",
        function ($scope, leafletData,$http, $state, $stateParams,
                   SERVER_URL,$timeout,gisAdminUnitsApi) {
        $scope.county_code = $stateParams.county_code;
        $scope.constituency_code = $stateParams.constituency_code;
        $scope.ward_code = $stateParams.ward_code;
        angular.extend($scope, {
            defaults: {
                scrollWheelZoom: false,
                tileLayer: "",
                dragging:true
            },
            layers:{
                overlays:{
                    wards:{
                        name:"Wards",
                        type:"group",
                        visible: true
                    }
                }
            }
        });
        $scope.ward_code = $stateParams.ward_code;
        gisAdminUnitsApi.ward.get($scope.ward_code)
        .success(function (ward_data) {
            $scope.ward = ward_data;
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

            angular.extend($scope, {
                    geojson: {
                        data: ward_data,
                        style: {
                            fillColor: "rgba(236, 255, 183, 0.14)",
                            weight: 2,
                            opacity: 1,
                            color: "rgba(47, 47, 47, 0.7)",
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
            gisAdminUnitsApi.getFacCoordinates()
            .then(function (data){
                var marks = _.filter(data,{5:$scope.ward_code});
                $scope.facility_count = marks.length;
                var markers = _.mapObject(marks, function(mark){
                    return  {
                            layer: "facilities",
                            lat: mark[2],
                            lng: mark[1],
                            label: {
                                message: mark[0],
                                options: {
                                    noHide: true
                                }
                            },
                            riseOnHover: true
                        };
                });
                $scope.markers = markers;
            },function(err) {
                $scope.alert = err.error;
            });
        })
        .error(function (error) {
            console.log(error);
        });
    }]);
})(window.angular, window._);
