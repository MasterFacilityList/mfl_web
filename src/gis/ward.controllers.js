(function(angular){
    "use strict";
    angular
        .module("mfl.gis_ward.controllers", ["leaflet-directive",
            "mfl.gis.wrapper","mfl.adminunits.wrapper"])
        .controller("mfl.gis.controllers.gis_ward", ["$scope","leafletData",
            "constsApi","$http","$state","$stateParams","SERVER_URL","gisWardsApi",
            "gisWard","$timeout",
            function ($scope, leafletData, constsApi, $http, $state, $stateParams,
                       SERVER_URL, gisWardsApi, gisWard,$timeout) {
            $scope.tooltip = {
                "title": "",
                "checked": false
            };
            $scope.ward = gisWard.data;
            $scope.title = [
                {
                    icon: "fa-map-marker",
                    name: "Ward"
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
            leafletData.getMap()
                .then(function (map) {
                var coords = gisWard.data.properties.bound.coordinates[0];
                var bounds = _.map(coords, function(c) {
                    return [c[1], c[0]];
                });
                map.fitBounds(bounds);
                map.spin(true,  {lines: 13, length: 20,corners:1,radius:30,width:10});
                $timeout(function() {map.spin(false);}, 1000);
            });
            $scope.filters = {
                id : $stateParams.const_id
            };

            angular.extend($scope, {
                defaults: {
                    scrollWheelZoom: false,
                    tileLayer: ""
                }
            });
                
            $scope.filters = {
                id : $stateParams.ward_id
            };
                
            gisWardsApi.api
            .filter($scope.filters)
            .success(function (data){
                $scope.ward = data.results.features[0];
                angular.extend($scope, {
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
            .error(function(err){
                /*TODO Error handling*/
                console.log(err);
            });
        }]);
})(angular);