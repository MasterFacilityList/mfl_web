(function(angular){
    "use strict";
    angular
    .module("mfl.gis_const.controllers", ["leaflet-directive",
        "mfl.gis.wrapper","mfl.adminunits.wrapper"])
    .controller("mfl.gis.controllers.gis_const", ["$scope","leafletData",
        "constsApi","$http","$state","$stateParams","SERVER_URL","gisWardsApi",
        "gisConst","$timeout","gisFacilitiesApi",
        function ($scope, leafletData, constsApi, $http, $state,
                   $stateParams,SERVER_URL, gisWardsApi,
                  gisConst,$timeout,gisFacilitiesApi) {
        $scope.constituency = gisConst.data;
        $scope.const_id = $stateParams.const_id;
        $scope.ward_boundaries = $stateParams.ward_boundaries;
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
                tileLayer: ""
            },
            markers:{},
            layers:{}
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
        gisFacilitiesApi.api
        .filter($scope.filters_const)
        .success(function (data){
            var marks = data.results.features;
            $scope.facility_count = marks.length;
            var heatpoints = _.map(marks, function(heat){
                return [
                        heat.geometry.coordinates[1],
                        heat.geometry.coordinates[0]
                    ];
            });
            $scope.heatpoints = heatpoints;
            $scope.layers.overlays.heat = {
                name: "Facilities",
                type: "heat",
                data: angular.copy($scope.heatpoints),
                layerOptions: {
                    radius: 25,
                    opacity:1,
                    blur: 1,
                    gradient: {0.05: "lime", 0.1: "orange",0.2: "red"}
                },
                visible: true
            };
        })
        .error(function (e){
            $scope.alert = e.error;
        });


        $scope.filters = {
            id : $stateParams.ward_boundaries
        };
        gisWardsApi.api
        .filter($scope.filters)
        .success(function (data){
            var marks = data.results.features;
            var markers = _.mapObject(marks, function(mark){
                return  {
                        layer:"wards",
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
            $scope.markers = markers;
            angular.extend($scope, {
                markers: markers,
                geojson: {
                    data: data.results,
                    style: {
                        fillColor: "rgba(255, 255, 255, 0.17)",
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
                            name: "Base",
                            url: "/assets/img/transparent.png",
                            type:"xyz",
                            data:[]
                        }
                    },
                    overlays:{
                        wards:{
                            name:"Wards",
                            type:"markercluster",
                            visible: true
                        }
                    }
                },
                selectedWard: {}
            });
        })
        .error(function(e){
            /*TODO Error handling*/
            $scope.alert = e.error;
        });
        $scope.$on("leafletDirectiveGeoJson.mouseover", function(ev, ward) {
            var model = ward.model;
            $scope.hoveredWard= model;
        });
        $scope.$on("leafletDirectiveGeoJson.click", function(ev, ward) {
            $state.go("gis_ward",{ward_id: ward.model.id});
        });
    }]);
})(angular);