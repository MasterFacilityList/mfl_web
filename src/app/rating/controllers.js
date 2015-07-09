(function (angular) {
    "use strict";

    angular.module("mfl.rating.controllers", [])

    .controller("mfl.rating.controllers.rating", ["$scope", "$stateParams",
        "facilitiesApi", "$window", "mfl.rating.services.rating","gisAdminUnitsApi",
        function ($scope, $stateParams,facilitiesApi, $window, ratingService,gisAdminUnitsApi) {
            $scope.spinneractive = true;
            $scope.tooltip = {
                "title": "",
                "checked": false
            };
            gisAdminUnitsApi.getCounties.list()
                .success(function (data) {
                    $scope.gis_county =data;
                })
                .error(function (error) {
                    $scope.error = error;
                });
            $scope.fac_id = $stateParams.fac_id;
            $scope.oneFacility = {};
            $scope.getFacility = function () {
                facilitiesApi.chus.filter({"facility" : $scope.fac_id})
                .success(function (data) {
                    $scope.chus = data.results;
                })
                .error(function (e) {
                    $scope.alert = e.error;
                });
                facilitiesApi.facilities.get($scope.fac_id)
                .success(function (data) {
                    $scope.spinneractive = false;
                    $scope.rating = [
                        {
                            current: 3,
                            max: 5
                        }
                    ];
                    $scope.oneFacility = data;
                    _.each($scope.oneFacility.facility_services,
                        function (service) {
                            var current_rate = "";
                            current_rate = ratingService.getRating(service.id);
                            if(!_.isNull(current_rate)) {
                                service.ratings = [
                                    {
                                        current : current_rate,
                                        max: 5
                                    }
                                ];
                            }
                            else {
                                service.ratings = [
                                    {
                                        current : 0,
                                        max: 5
                                    }
                                ];
                            }
                        }
                    );
                })
                .error(function (e) {
                    $scope.alert_main = e.detail;
                    $scope.spinneractive = false;
                });
            };
            $scope.getFacility();

            $scope.getSelectedRating = function (rating, id, service_obj) {
                $scope.fac_rating = {
                    facility_service : id,
                    rating : rating
                };
                service_obj.spinner = true;
                facilitiesApi.ratings.create($scope.fac_rating)
                    .success(function (data) {
                        //save rating in localStorage
                        service_obj.spinner = false;
                        ratingService.storeRating(
                            data.facility_service, data.rating);
                        $scope.getFacility();
                        toastr.success("Successfully rated");
                    })
                    .error(function (e) {
                        service_obj.spinner = false;
                        $scope.alert = e.detail || "Service can only be rated once a day";
                        console.log(e);
                        toastr.error($scope.alert);
                    });
            };

            //printing function
            $scope.printing = function () {
                $window.print();
            };
        }
    ]);
})(angular);
