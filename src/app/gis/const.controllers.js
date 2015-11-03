(function (angular, _){
    "use strict";

    /**
     * @ngdoc module
     *
     * @name mfl.gis_const.controllers
     *
     * @description
     * Contains the controller used in the constituency view
     */
    angular.module("mfl.gis_const.controllers", [
        "leaflet-directive",
        "nemLogging",
        "mfl.gis.wrapper"
    ])

    /**
     * @ngdoc controller
     *
     * @name mfl.gis.controllers.gis_const
     *
     * @description
     * Controller for the constituency view
     */
    .controller("mfl.gis.controllers.gis_const", ["$scope","leafletData",
        "$http","$state","$stateParams","SERVER_URL",
        "$timeout","gisAdminUnitsApi","$q",
        function ($scope, leafletData, $http, $state,
                   $stateParams,SERVER_URL,
                  $timeout,gisAdminUnitsApi, $q) {
        $scope.county_id = $stateParams.county_id;
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
                }
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
        gisAdminUnitsApi.counties.get($scope.county_id).success(function (data) {
            $scope.county = data;
        }).error(function (err) {
            console.log(err);
        });
        $scope.const_id = $stateParams.const_id;
        gisAdminUnitsApi.constituencies.get($scope.const_id)
        .success(function (const_data) {
            $scope.constituency = const_data;
            $scope.const_boundaries = $stateParams.const_boundaries;
            $scope.ward_boundaries = $stateParams.ward_boundaries;
            $scope.spinner = false;
            $scope.tooltip = {
                "title": "",
                "checked": false
            };
            $scope.filters = {
                id : $stateParams.const_id
            };
            leafletData.getMap("constmap")
                .then(function (map) {
                    var coords = const_data.properties.bound.coordinates[0];
                    var bounds = _.map(coords, function(c) {
                        return [c[1], c[0]];
                    });
                    map.fitBounds(bounds);
                    map.spin(true,  {lines: 13, length: 20,corners:1,
                        radius:30,width:10});
                    $timeout(function() {map.spin(false);}, 500);
                });


            $scope.filters_const = {
                "fields":"geometry,constituency",
                constituency : const_data.properties.constituency_id
            };
            var facilitiesPromise = gisAdminUnitsApi.facilities.filter($scope.filters_const);

            $scope.filters = {
                id : $stateParams.ward_boundaries
            };
            var wardBoundariesPromise = gisAdminUnitsApi.wards.filter($scope.filters);

            $q.all([facilitiesPromise,wardBoundariesPromise])
            .then(function(payload){
                var fac_marks = payload[0].data;
                var county_marks = payload[1].data.results.features;
                $scope.facility_count = fac_marks.length;
                var heatpoints = _.map(fac_marks, function(heat){
                    return [
                            heat.geometry.coordinates[1],
                            heat.geometry.coordinates[0]
                        ];
                });
                var markers = _.mapObject(county_marks, function(mark){
                    return {
                            layer:"wards",
                            lat: mark.properties.center.coordinates[1],
                            lng: mark.properties.center.coordinates[0],
                            label: {
                                message: ""+mark.properties.name+"",
                                options: {
                                    noHide: false
                                }
                            },
                            riseOnHover: true
                        };
                });
                $scope.marks = markers;
                angular.extend($scope, {
                    geojson: {
                        data: payload[1].data.results,
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
                            Constituency: {
                                name: "Constituency",
                                url: "/assets/img/transparent.png",
                                type:"xyz",
                                data:[]
                            }
                        },
                        overlays:{
                            wards:{
                                name:"Wards",
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
                        selectedWard: {}
                    },
                    markers: markers
                });
            });
            $scope.$on("leafletDirectiveGeoJson.constmap.mouseover", function(ev, ward) {
                $scope.hoveredWard= ward.model;
            });
            $scope.$on("leafletDirectiveGeoJson.constmap.click", function(ev, ward) {
                $scope.spinner = true;
                $state.go("gis_county.gis_const.gis_ward",
                           {county_id:$stateParams.county_id,
                            county_boundaries:$stateParams.const_boundaries,
                            const_id:$stateParams.const_id,
                            ward_boundaries : $stateParams.ward_boundaries,
                            ward_id: ward.model.id});
            });
        })
        .error(function (err) {
            console.log(err);
        });
    }]);
})(window.angular, window._);
