(function (angular) {
    "use strict";

    angular.module("mfl.gis.controllers", [
        "leaflet-directive",
        "mfl.gis.wrapper",
        "mfl.adminunits.wrapper",
        "mfl.gis.interceptors"
    ])

    .controller("mfl.gis.controllers.gis", ["$scope", "countiesApi", "$http", "SERVER_URL",
        function ($scope, countiesApi, $http, SERVER_URL) {
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
        var url = SERVER_URL + "api/gis/county_boundaries/?format=json&page_size=47";
        $http.get(url, {cache: "true"})
            .success(function (data) {
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
    }]);
})(angular);
