"use strict";
angular
    .module("mfl.gis.controllers", ["leaflet-directive",
        "mfl.gis.countries.wrapper","mfl.gis.counties.wrapper","mfl.gis.consts.wrapper",
        "mfl.gis.interceptors", "mfl.counties.wrapper"])
    .controller("mfl.gis.controllers.gis", ["$scope",
        "gisCountriesApi","$http","$state","$stateParams",
        function ($scope, countiesApi, $http, $state, $stateParams) {
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
                icon: "fa-marker",
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
        // Get the counties data from a JSON
        $http.get("assets/counties.json").success(function (data) {
            // Put the counties on an associative array
            $scope.counties = {};
            for (var i = 0; i < data.length; i++) {
                var county = data[i];
                $scope.counties[county.name] = county;
            }
        });
        angular.extend($scope, {
            KEN: {
                lat: 0.53,
                lng: 37.85,
                zoom: 6
            }
        });
/*
WHERE THE AWESOMENESS BEGINS
*/
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
                        fillOpacity: 0.7
                    }
                },
                selectedCountry: {}
            });
        });
        $scope.$on("leafletDirectiveMap.geojsonMouseover", function(ev, feature, leafletEvent) {
            countyMouseover(feature, leafletEvent);
        });
        $scope.$on("leafletDirectiveMap.geojsonClick", function(ev, featureSelected, leafletEvent) {
            countyClick(featureSelected, leafletEvent);
        });
        function countyClick(county) {
            $scope.countyClicked = county;
            $stateParams.county_id = county.id;
            $state.go("gis_county",{county_id : county.id});
        }
            
        // Mouse over function, called from the Leaflet Map Events
        function countyMouseover(feature) {
            $scope.hoveredCounty = feature;
        }
    }])
    .controller("mfl.gis.controllers.gis_county", ["$scope",
        "countiesApi","$http","$state","$stateParams",
        function ($scope, countiesApi, $http,$state,$stateParams) {
        // Get the counties data from a JSON
        countiesApi.api
            .get($stateParams.county_id)
            .success(function (data) {
                $scope.country = data;
                angular.extend($scope, {
                    county: {
                        lat: data.properties.latitude,
                        lon: data.properties.longitude,
                        zoom: 6
                    }
                });
            })
            .error(function (error) {
                console.log(error);
            });
        $http.get("http://localhost/api/gis/constituency_boundaries/?county="+
                  $stateParams.county_id+
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
        $scope.$on("leafletDirectiveMap.geojsonMouseover", function(ev, feature, leafletEvent) {
            constMouseover(feature, leafletEvent);
        });
        $scope.$on("leafletDirectiveMap.geojsonClick", function(ev, featureSelected, leafletEvent) {
            constClick(featureSelected, leafletEvent);
        });
        function constClick(constituency) {
            $scope.clickedConst = constituency;
            $stateParams.constituency_id = constituency.id;
            $state.go("gis.county.constituency",{constituency_id : constituency.id});
        }
            
        // Mouse over function, called from the Leaflet Map Events
        function constMouseover(feature) {
            $scope.hoveredConst = feature;
        }
    }])
    .controller("mfl.gis.controllers.gis_const", ["$scope",
        "constituenciesApi","$http","$state","$stateParams",
        function ($scope, constsApi, $http,$state,$stateParams) {
        // Get the counties data from a JSON
        constsApi.api
            .get($stateParams.county_id)
            .success(function (data) {
                $scope.country = data;
                angular.extend($scope, {
                    county: {
                        lat: data.properties.latitude,
                        lon: data.properties.longitude,
                        zoom: 6
                    }
                });
            })
            .error(function (error) {
                console.log(error);
            });
        $http.get("http://localhost/api/gis/ward_boundaries/?county="+
                  $stateParams.county_id+
                  "format=json",
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
        $scope.$on("leafletDirectiveMap.geojsonMouseover", function(ev, feature, leafletEvent) {
            constMouseover(feature, leafletEvent);
        });
        $scope.$on("leafletDirectiveMap.geojsonClick", function(ev, featureSelected, leafletEvent) {
            constClick(featureSelected, leafletEvent);
        });
        function constClick(ward) {
            $scope.clickedConst = ward;
            $stateParams.ward_id = ward.id;
            $state.go("gis_ward",{ward_id : ward.id});
        }
            
        // Mouse over function, called from the Leaflet Map Events
        function constMouseover(feature) {
            $scope.hoveredConst = feature;
        }
    }])
    .controller("mfl.gis.controllers.gis_ward", ["$scope",
        "wardsApi","$http","$state","$stateParams",
        function ($scope, wardsApi, $http,$state,$stateParams) {
        // Get the counties data from a JSON
        wardsApi.api
            .get($stateParams.ward_id)
            .success(function (data) {
                $scope.country = data;
                angular.extend($scope, {
                    county: {
                        lat: data.properties.latitude,
                        lon: data.properties.longitude,
                        zoom: 6
                    }
                });
            })
            .error(function (error) {
                console.log(error);
            });
        $http.get("http://localhost/api/gis/ward_boundaries/?ward="+
                  $stateParams.ward_id+
                  "format=json",
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
    }]);