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
        "SERVER_URL","gisAdminUnitsApi","$q",
        function ($scope, leafletData, $http, $state,
                   $stateParams, $timeout,
                   SERVER_URL,gisAdminUnitsApi,$q) {
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
                    constituencies:{
                        name:"Constituencies",
                        type:"group",
                        visible: true
                    }
                }
            }
        });
        gisAdminUnitsApi.counties.get($scope.county_id)
        .success(function (county_data){
            $scope.county = county_data;
            $scope.const_boundaries = $stateParams.const_boundaries;
            $scope.spinner = false;
            $scope.tooltip = {
                "title": "",
                "checked": false
            };

            $scope.filters = {
                id : $stateParams.county_id
            };
            leafletData.getMap("countymap")
                .then(function (map) {
                    var coords = county_data.properties.bound.coordinates[0];
                    var bounds = _.map(coords, function(c) {
                        return [c[1], c[0]];
                    });
                    map.fitBounds(bounds);
                    map.spin(true,
                        {lines: 13, length: 20,corners:1,radius:30,width:10});
                    $timeout(function() {map.spin(false);}, 500);
                });

            $scope.filters_county = {
                "fields":"geometry,county",
                county : county_data.properties.county_id
            };
            var facilitiesPromise = gisAdminUnitsApi.facilities.filter($scope.filters_county);

            $scope.filters = {
                id : $stateParams.const_boundaries
            };
            var constBoundariesPromise = gisAdminUnitsApi.constituencies.filter($scope.filters);

            $q.all([facilitiesPromise, constBoundariesPromise])
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
                            layer:"constituencies",
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

            });
            $scope.$on("leafletDirectiveGeoJson.countymap.mouseover", function(ev, constituency) {
                $scope.hoveredConst = constituency.model;
            });
            $scope.$on("leafletDirectiveGeoJson.countymap.click", function(ev, constituency) {
                $scope.spinner = true;
                var boundary_ids = constituency.model.properties.ward_boundary_ids.join(",");
                $stateParams.ward_boundaries = boundary_ids;
                $state.go("gis_county.gis_const",{county_id:$stateParams.county_id,
                                        county_boundaries:$stateParams.const_boundaries,
                                        const_id:constituency.model.id,
                                        ward_boundaries : boundary_ids});
            });

        })
        .error(function (err) {
            console.log(err);
        });
    }]);
})(window.angular, window._);
