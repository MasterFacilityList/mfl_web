(function (angular) {
    "use strict";

    angular.module("mfl.rating.controllers", [])

    .controller("mfl.rating.controllers.rating", ["$scope",
        "facilitiesApi",
        function ($scope, facilitiesApi) {
            $scope.test = "Rating";
            $scope.fac_id = "1e0d5bc8-aa79-4c38-b938-714c28837c61";
            facilitiesApi.facilities.get($scope.fac_id)
                .success(function (data) {
                    $scope.rating = [
                        {
                            current: 3,
                            max: 5
                        }
                    ];
                    $scope.oneFacility = data;
                    _.each($scope.oneFacility.facility_services,
                        function (service) {
                            service.ratings = [
                                {
                                    current : 0,
                                    max: 5
                                }
                            ];
                        }
                    );
                })
                .error(function (e) {
                    $scope.alert = e.error;
                });

            $scope.getSelectedRating = function (rating, id) {
                console.log(rating, id);
                $scope.fac_rating = {
                    facility_service : id,
                    rating : rating
                };
                facilitiesApi.ratings.create($scope.fac_rating)
                    .success(function (data) {
                        console.log(data);
                    })
                    .error(function (e) {
                        $scope.alert = e.error;
                    });
            };
        }
    ]);
})(angular);
