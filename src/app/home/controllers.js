"use strict";
angular.module("mfl.home.controllers", ["mfl.facilities.wrapper"])

    .controller("mfl.home.controllers.home", ["$scope",
        "facilitiesApi",function ($scope, facilitiesApi) {
        $scope.test="home";
        $scope.pubed_fac = [];
        $scope.latest_fac = {
            page_size : 10
        };
        facilitiesApi.api.filter($scope.latest_fac)
            .success(function (facilities) {
                $scope.new_facilities = _.where(facilities.results, {"is_published" : true});
                for(var i=0; i < 4; ++i) {
                    $scope.pubed_fac.push($scope.new_facilities[i]);
                }
                console.log($scope.new_facilities);
            })
            .error(function (e) {
                console.log(e);
            });
    }])

    .controller("mfl.home.controllers.header", ["$scope",
        function ($scope) {
            $scope.test = "Search";

        }
    ]);
