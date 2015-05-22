(function(angular){
    "use strict";
    angular
    .module("mfl.gis_county.controllers", ["leaflet-directive",
        "mfl.gis.wrapper"])
    .controller("mfl.gis.controllers.gis_county", ["$scope","leafletData",
        "gisCounty","$http","$state","$stateParams", "$timeout",
        "SERVER_URL","gisConstsApi","gisFacilitiesApi",
        function ($scope, leafletData, gisCounty, $http, $state,
                   $stateParams, $timeout,
                   SERVER_URL, gisConstsApi,gisFacilitiesApi) {
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
                tileLayer: ""
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
        gisFacilitiesApi.api
        .filter($scope.filters_county)
        .success(function (data){
            var marks = data.results.features;
            $scope.facility_count = marks.length;
        })
        .error(function (e){
            $scope.alert = e.error;
        });




        $scope.filters = {
            id : $stateParams.const_boundaries
        };
        gisConstsApi.api
        .filter($scope.filters)
        .success(function (data){
            var marks = data.results.features;
            var markers = _.mapObject(marks, function(mark){
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
                    data: data.results,
                    style: {
                        fillColor: "rgba(255, 165, 0, 0.79)",
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
                        }
                    }
                },
                markers: markers,
                selectedConst: {}
            });
        })
        .error(function(e){
            /*TODO Error handling*/
            $scope.alert = e.error;
        });
        $scope.$on("leafletDirectiveMap.geojsonMouseover", function(ev, constituency) {
            $scope.hoveredConst = constituency;
        });
        $scope.$on("leafletDirectiveMap.geojsonClick", function(ev, constituency) {
            var boundary_ids = constituency.properties.ward_boundary_ids.join(",");
            $stateParams.ward_boundaries = boundary_ids;
            $state.go("gis_const",{const_id:constituency.id,
                                    ward_boundaries : boundary_ids});
        });
    }]);
})(angular);