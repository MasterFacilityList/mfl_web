"use strict";
angular
    .module("mfl.gis.controllers", ["leaflet-directive",
        "mfl.gis.wrapper","mfl.adminunits.wrapper","mfl.gis.interceptors"])

    .controller("mfl.gis.controllers.gis", ["$scope","leafletData",
        "countiesApi","$http","$stateParams","$state","SERVER_URL",
        function ($scope,leafletData, countiesApi, $http, $stateParams, $state, SERVER_URL) {
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
        $http.get(SERVER_URL+"api/gis/county_boundaries/?format=json&page_size=47",
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
        "gisCountiesApi","$http","$state","$stateParams","SERVER_URL",
        function ($scope, leafletData, gisCountiesApi, $http, $state, $stateParams,SERVER_URL) {
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
        $http.get(SERVER_URL+ "api/gis/"+
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
                selectedConst: {}
            });
        });
        $scope.$on("leafletDirectiveMap.geojsonMouseover", function(ev, constituency) {
            $scope.hoveredConst = constituency;
        });
        $scope.$on("leafletDirectiveMap.geojsonClick", function(ev, constituency) {
            var boundary_ids = constituency.properties.ward_boundary_ids.join(",");
            $stateParams.ward_boundaries = boundary_ids;
            var center = constituency.properties.center.coordinates[1]+":"+
                constituency.properties.center.coordinates[0]+":"+9;
            $state.go("gis_const",{const_id:constituency.id,
                                    ward_boundaries : boundary_ids,c:center});
        });
    }])
    .controller("mfl.gis.controllers.gis_const", ["$scope","leafletData",
        "constsApi","$http","$state","$stateParams","SERVER_URL",
        function ($scope, leafletData, constsApi, $http, $state, $stateParams,SERVER_URL) {
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
                name: "GIS County",
                route: "gis_county"
            },
            {
                name: "GIS Constituency",
                route: "gis_const"
            }
        ];
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
            constituency: {
                lat: 0.53,
                lng: 37.858,
                zoom: 6
            }
        });
        if ($stateParams.c) {
            var split_coords = $stateParams.c.split(":");
            $scope.constituency.lat = parseFloat(split_coords[0], 10);
            $scope.constituency.lng = parseFloat(split_coords[1], 10);
            $scope.constituency.zoom = parseInt(split_coords[2], 10);
        }
        $http.get(SERVER_URL+ "api/gis/"+
                  "ward_boundaries/?id="+
                  $stateParams.ward_boundaries +
                  "&format=json",
                  {cache: "true"})
            .success(function (data){
            angular.extend($scope, {
                geojson: {
                    data: data,
                    style: {
                        fillColor: "#00ceff",
                        weight: 2,
                        opacity: 1,
                        color: "white",
                        dashArray: "3",
                        fillOpacity: 0.7
                    }
                },
                selectedWard: {}
            });
        });
        $scope.$on("leafletDirectiveMap.geojsonMouseover", function(ev, ward) {
            $scope.hoveredWard= ward;
        });
        $scope.$on("leafletDirectiveMap.geojsonClick", function(ev, ward) {
            var center = ward.properties.center.coordinates[1]+":"+
                ward.properties.center.coordinates[0]+":"+10;
            $state.go("gis_ward",{ward_id:ward.id,c:center});
        });
    }])
    .controller("mfl.gis.controllers.gis_ward", ["$scope","leafletData",
        "constsApi","$http","$state","$stateParams","SERVER_URL",
        function ($scope, leafletData, constsApi, $http, $state, $stateParams,SERVER_URL) {
        $scope.tooltip = {
            "title": "",
            "checked": false
        };
        $scope.path = [
            {
                name: "Kenya Map",
                route: "gis"
            },
            {
                name: "County Map",
                route: "gis_county"
            },
            {
                name: "Constituency Map",
                route: "gis_const"
            },
            {
                name: "Ward Map",
                route: "gis_ward"
            }
        ];
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
        $scope.filters = {
            id : $stateParams.const_id
        };
            
        angular.extend($scope, {
            defaults: {
                scrollWheelZoom: false,
                tileLayer: ""
            },
            ward: {
                lat: 0.53,
                lng: 37.858,
                zoom: 6
            }
        });
        if ($stateParams.c) {
            var split_coords = $stateParams.c.split(":");
            $scope.ward.lat = parseFloat(split_coords[0], 10);
            $scope.ward.lng = parseFloat(split_coords[1], 10);
            $scope.ward.zoom = parseInt(split_coords[2], 10);
        }
        $http.get(SERVER_URL+ "api/gis/"+
                  "ward_boundaries/?id="+
                  $stateParams.ward_id +
                  "&format=json",
                  {cache: "true"})
            .success(function (data){
            angular.extend($scope, {
                geojson: {
                    data: data,
                    style: {
                        fillColor: "#00ceff",
                        weight: 2,
                        opacity: 1,
                        color: "white",
                        dashArray: "3",
                        fillOpacity: 0.7
                    }
                },
                selectedWard: {}
            });
        });
        $scope.$on("leafletDirectiveMap.geojsonMouseover", function(ev, ward) {
            $scope.hoveredWard= ward;
        });
        $scope.$on("leafletDirectiveMap.geojsonClick", function(ev, ward) {
            var boundary_ids = ward.properties.ward_boundary_ids.join(",");
            $stateParams.ward_area = boundary_ids;
            var center = ward.properties.center.coordinates[1]+":"+
                ward.properties.center.coordinates[0]+":"+
            $state.go("gis_const",{const_id:ward.id,
                                    ward_boundaries : boundary_ids,c:center});
        });
    }]);