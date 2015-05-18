"use strict";

angular.module("mfl.rating.controllers", [])

    .controller("mfl.rating.controllers.rating", ["$scope",
        "facilitiesApi",
        function ($scope, facilitiesApi) {
            $scope.test = "Rating";
            $scope.fac_id = "1e0d5bc8-aa79-4c38-b938-714c28837c61";
            facilitiesApi.facilities.get($scope.fac_id)
                .success(function (data) {
                    console.log(data);
                    $scope.oneFacility = data;
                })
                .error(function (e) {
                    console.log(e.error);
                });

            $scope.ratings = [
                {
                    current: 3,
                    max: 5
                }
            ];

            $scope.getSelectedRating = function (rating) {
                console.log(rating);
            };
        }
    ]);
