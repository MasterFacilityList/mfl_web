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
            markers:{}
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
                        fillColor: "rgba(24, 246, 255, 0.59)",
                        weight: 2,
                        opacity: 1,
                        color: "white",
                        dashArray: "3",
                        fillOpacity: 0.7
                    }
                },
                selectedWard: {}
            });
        })
        .error(function(e){
            /*TODO Error handling*/
            $scope.alert = e.error;
        });
        $scope.$on("leafletDirectiveMap.geojsonMouseover", function(ev, ward) {
            $scope.hoveredWard= ward;
        });
        $scope.$on("leafletDirectiveMap.geojsonClick", function(ev, ward) {
            $state.go("gis_ward",{ward_id:ward.id});
        });
    }]);
})(angular);