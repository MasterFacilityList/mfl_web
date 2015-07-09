(function(angular){
    "use strict";
    angular
    .module("mfl.gis_const.controllers", ["leaflet-directive",
        "mfl.gis.wrapper","mfl.adminunits.wrapper"])
    .controller("mfl.gis.controllers.gis_const", ["$scope","leafletData",
        "$http","$state","$stateParams","SERVER_URL",
        "gisConst","$timeout","gisAdminUnitsApi","$q","gisCounty",
        function ($scope, leafletData, $http, $state,
                   $stateParams,SERVER_URL,
                  gisConst,$timeout,gisAdminUnitsApi, $q,gisCounty) {
        $scope.county = gisCounty.data;
        $scope.constituency = gisConst.data;
        $scope.county_id = $stateParams.county_id;
        $scope.const_boundaries = $stateParams.const_boundaries;
        $scope.const_id = $stateParams.const_id;
        $scope.ward_boundaries = $stateParams.ward_boundaries;
        $scope.spinner = false;
        $scope.tooltip = {
            "title": "",
            "checked": false
        };
        $scope.title = [
            {
                icon: "fa-map-marker",
                name: "Constituency"
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
            id : $stateParams.const_id
        };
        angular.extend($scope, {
            defaults: {
                scrollWheelZoom: false,
                tileLayer: "",
                dragging:true
            },
            markers:{},
            layers:{
                overlays:{}
            }
        });
        leafletData.getMap("constmap")
            .then(function (map) {
                var coords = gisConst.data.properties.bound.coordinates[0];
                var bounds = _.map(coords, function(c) {
                    return [c[1], c[0]];
                });
                map.fitBounds(bounds);
                map.spin(true,  {lines: 13, length: 20,corners:1,
                    radius:30,width:10});
                $timeout(function() {map.spin(false);}, 500);
            });


        $scope.filters_const = {
            constituency : gisConst.data.properties.constituency_id
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
        $scope.$on("leafletDirectiveGeoJson.mouseover", function(ev, ward) {
            $scope.hoveredWard= ward.model;
        });
        $scope.$on("leafletDirectiveGeoJson.click", function(ev, ward) {
            $scope.spinner = true;
            $state.go("gis.gis_county.gis_const.gis_ward",
                       {county_id:$stateParams.county_id,
                        county_boundaries:$stateParams.const_boundaries,
                        const_id:$stateParams.const_id,
                        ward_boundaries : $stateParams.ward_boundaries,
                        ward_id: ward.model.id});
        });
    }]);
})(angular);
