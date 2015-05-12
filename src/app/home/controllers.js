"use strict";
angular.module("mfl.home.controllers", ["mfl.facilities.wrapper"])

    .controller("mfl.home.controllers.home", ["$scope",
        function ($scope) {
        $scope.test="home";
        $scope.tooltip = {
            "title": "",
            "checked": false
        };
    }])

    .controller("mfl.home.controllers.header", ["$scope",
        "$state",
        function ($scope, $state) {
            $scope.test = "Search";
            $scope.search = function (query) {
                $state.go("home.search_results", {result: query});
            };
        }
    ])

    .controller("mfl.home.controllers.search_results", ["$scope",
        "facilitiesApi", "$state",
        function ($scope, facilitiesApi, $state) {
            $scope.test = "search results";
            $scope.search = {
                search : $state.params.result
            };
            $scope.query = $state.params.result;
            //doing the search query
            facilitiesApi.api.filter($scope.search)
                .success(function (query_rslt) {
                    $scope.query_results = query_rslt.results;
                    console.log($scope.query_results);
                })
                .error(function (e) {
                    console.log(e.error);
                });
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
            facilitiesApi.api.get($state.params.fac_id)
                .success(function (one_fac) {
                    $scope.oneFacility = one_fac;
                })
                .error(function (e) {
                    console.log(e);
                });
        }
    ]);
