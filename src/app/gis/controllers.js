"use strict";
angular
    .module("mfl.gis.controllers", ["leaflet-directive",
        "mfl.gis.wrapper","mfl.adminunits.wrapper","mfl.gis.interceptors"])

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
            $stateParams.county_id = county.id;
            $state.go("gis_county",{county_id : county.id});
        }
            
        // Mouse over function, called from the Leaflet Map Events
        function countyMouseover(feature) {
            $scope.hoveredCounty = feature;
        }
    }]);