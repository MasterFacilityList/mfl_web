"use strict";
angular.module("mfl.home.controllers", ["mfl.facilities.wrapper"])

    .controller("mfl.home.controllers.home", ["$scope", "$state",
        function ($scope, $state) {
        $scope.test="home";
        $scope.tooltip = {
            "title": "",
            "checked": false
        };
        $scope.search = function (query) {
            $state.go("search_results", {result: query});
        };
    }])

    .controller("mfl.home.controllers.header", ["$scope",
        function ($scope) {
            $scope.test = "Search";
        }
    ])

    .controller("mfl.home.controllers.search_results", ["$scope",
        "facilitiesApi", "$state", "downloadApi",
        function ($scope, facilitiesApi, $state, downloadApi) {
            $scope.test = "search results";
            $scope.search = {
                search : $state.params.result
            };
            $scope.tooltip = {
                "title": "",
                "checked": false
            };
            $scope.page = true;
            $scope.search_results = true;
            $scope.no_result = false;
            $scope.query = $state.params.result;
            $scope.err = "";
            //doing the search query
            facilitiesApi.facilities.filter($scope.search)
                .success(function (query_rslt) {
                    $scope.search_results = false;
                    $scope.query_results = query_rslt.results;
                    console.log($scope.query_results);
                    if($scope.query_results.length === 0) {
                        $scope.no_result = true;
                    }
                })
                .error(function (e) {
                    console.log(e.error);
                    $scope.err = e.error;
                    $scope.search_results = false;
                });
            //exporting to excel functionality
            $scope.excelExport = function () {
                console.log("Called");
                $scope.excel_filters = {
                    search : $state.params.result,
                    format : "excel"
                };
                facilitiesApi.facilities.filter($scope.excel_filters)
                    .success(function (data) {
                        console.log(data, downloadApi);
                        window.location.href =
                        "http://localhost:8061/api/common/download/download/xlsx/";
                    })
                    .error(function (e) {
                        console.log(e.error);
                    });
            };
        }
    ])

    .controller("mfl.home.controllers.facility_details", ["$scope",
        "facilitiesApi", "$state",
        function ($scope, facilitiesApi, $state) {
            $scope.test = "facility";
            $scope.tooltip = {
                "title": "",
                "checked": false
            };
            facilitiesApi.facilities.get($state.params.fac_id)
                .success(function (one_fac) {
                    $scope.oneFacility = one_fac;
                })
                .error(function (e) {
                    console.log(e);
                });
        }
    ]);
