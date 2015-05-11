"use strict";
angular
    .module("mfl.gis.controllers", ["leaflet-directive",
        "mfl.gis.wrapper","mfl.adminunits.wrapper","mfl.gis.interceptors"])

    .controller("mfl.gis.controllers.gis", ["$scope","leafletData",
        "countiesApi","$http","$stateParams","$state",
        function ($scope,leafletData, countiesApi, $http, $stateParams, $state) {
        $scope.tooltip = {
            "title": "",
            "checked": false
        };
        $scope.path = [
            {
                name: "GIS",
                route: "gis"
            }
        ];
        $scope.title = [
            {
                icon: "fa-map-marker",
                name: "Geographic Discovery"
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
            format: "json",
            page_size: 50
        };
        countiesApi.api
            .list($scope.filters)
            .success(function (data){
                $scope.counties = data;
            });
        angular.extend($scope, {
            KEN: {
                lat: 0.53,
                lng: 37.858,
                zoom: 6
            },
            defaults: {
                scrollWheelZoom: false,
                tileLayer: ""
            }
        });
        $http.get("http://localhost/api/gis/county_boundaries/?format=json&page_size=47",
                  {cache: "true"})
            .success(function (data){
            angular.extend($scope, {
                geojson: {
                    data: data,
                    style: {
                        fillColor: "green",
                        weight: 2,
                        opacity: 1,
                        color: "white",
                        dashArray: "3",
                        fillOpacity: 0.8
                    }
                },
                selectedCountry: {}
            });
        });
        $scope.$on("leafletDirectiveMap.geojsonMouseover", function(ev, county) {
            $scope.hoveredCounty = county;
        });
        $scope.$on("leafletDirectiveMap.geojsonClick", function(ev, county) {
            var boundary_ids = county.properties.constituency_boundary_ids.join(",");
            $stateParams.const_boundaries = boundary_ids;
            var center = county.properties.center.coordinates[1]+":"+
                county.properties.center.coordinates[0]+":"+8;
            $state.go("gis_county",{county_id: county.id,
                                    const_boundaries : boundary_ids,c:center});
        });
    }])
    .controller("mfl.gis.controllers.gis_county", ["$scope","leafletData",
        "gisCountiesApi","$http","$state","$stateParams",
        function ($scope, leafletData, gisCountiesApi, $http, $state, $stateParams) {
        $scope.tooltip = {
            "title": "",
            "checked": false
        };
        $scope.path = [
            {
                name: "GIS",
                route: "gis"
            },
            {
                name: "GIS",
                route: "country level"
            }
        ];
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
            county: {
                lat: 0.53,
                lng: 37.858,
                zoom: 6
            }
        });
        if ($stateParams.c) {
            var split_coords = $stateParams.c.split(":");
            $scope.county.lat = parseFloat(split_coords[0], 10);
            $scope.county.lng = parseFloat(split_coords[1], 10);
            $scope.county.zoom = parseInt(split_coords[2], 10);
        }
        $http.get("http://localhost/api/gis/"+
                  "constituency_boundaries/?id="+
                  $stateParams.const_boundaries +
                  "&format=json",
                  {cache: "true"})
            .success(function (data){
            angular.extend($scope, {
                geojson: {
                    data: data,
                    style: {
                        fillColor: "orange",
                        weight: 2,
                        opacity: 1,
                        color: "white",
                        dashArray: "3",
                        fillOpacity: 0.7
                    }
                },
                selectedCountry: {}
            });
        });
    }]);