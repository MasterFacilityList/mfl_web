(function(angular){
    "use strict";
    angular
    .module("mfl.gis_county.controllers", ["leaflet-directive",
        "mfl.gis.wrapper"])
    .controller("mfl.gis.controllers.gis_county", ["$scope","leafletData",
        "gisCounty","$http","$state","$stateParams", "$timeout",
        "SERVER_URL","gisConstsApi","gisFacilitiesApi","$q",
        function ($scope, leafletData, gisCounty, $http, $state,
                   $stateParams, $timeout,
                   SERVER_URL, gisConstsApi,gisFacilitiesApi,$q) {
        $scope.county = gisCounty.data;
        $scope.county_id = $stateParams.county_id;
        $scope.const_boundaries = $stateParams.const_boundaries;
        $scope.tooltip = {
            "title": "",
            "checked": false
        };
        $scope.title = [
            {
                icon: "fa-map-marker",
                name: "County"
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

        $scope.filters = {
            id : $stateParams.county_id
        };
        angular.extend($scope, {
            defaults: {
                scrollWheelZoom: false,
                tileLayer: "",
                dragging:false
            },
            markers:{},
            layers:{}
        });

        leafletData.getMap("countymap")
            .then(function (map) {
                var coords = gisCounty.data.properties.bound.coordinates[0];
                var bounds = _.map(coords, function(c) {
                    return [c[1], c[0]];
                });
                map.fitBounds(bounds);
                map.spin(true,
                    {lines: 13, length: 20,corners:1,radius:30,width:10});
                $timeout(function() {map.spin(false);}, 500);
            });



        $scope.filters_county = {
            county : gisCounty.data.properties.county_id
        };
        var facilitiesPromise = gisFacilitiesApi.api
        .filter($scope.filters_county);

        $scope.filters = {
            id : $stateParams.const_boundaries
        };
        var constBoundariesPromise = gisConstsApi.api
        .filter($scope.filters);

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
                            message: ""+mark.properties.name+"",
                            options: {
                                noHide: true
                            }
                        }
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
                        country: {
                            name: "Country",
                            url: "/assets/img/transparent.png",
                            type:"xyz",
                            data:[]
                        }
                    },
                    overlays:{
                        constituencies:{
                            name:"Constituencies",
                            type:"markercluster",
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
        $scope.$on("leafletDirectiveGeoJson.mouseover", function(ev, constituency) {
            $scope.hoveredConst = constituency.model;
        });
        $scope.$on("leafletDirectiveGeoJson.click", function(ev, constituency) {
            var boundary_ids = constituency.model.properties.ward_boundary_ids.join(",");
            $stateParams.ward_boundaries = boundary_ids;
            $state.go("gis.gis_county.gis_const",{county_id:$stateParams.county_id,
                                    county_boundaries:$stateParams.const_boundaries,
                                    const_id:constituency.model.id,
                                    ward_boundaries : boundary_ids});
        });
    }]);
})(angular);