"use strict";
(function(angular){
    angular.module("mfl.home.controllers", ["mfl.facilities.wrapper"])

    .controller("mfl.home.controllers.home", ["$scope", "$window",
        "searchService", "$state",
        function ($scope, $window, searchService, $state) {
        $scope.tooltip = {
            "title": "",
            "checked": false
        };
        $scope.isFocused = false;
        $scope.typeaheadFacilities = function () {
            $scope.isFocused = !$scope.isFocused;
            _.debounce(searchService.typeaheadFacilities("facilities"),
            300);
        };
        $scope.search = function (query) {
            $scope.loader = true;
            $state.go("facility_filter.results", {"search" : query});
        };
    }])

    .controller("mfl.home.controllers.header", ["$scope",
        function ($scope) {
            $scope.tooltip = {
                "title": "",
                "checked": false
            };
        }
    ])
    .controller("mfl.home.controllers.facility_details", ["$scope",
        "facilitiesApi", "$state",
        function ($scope, facilitiesApi, $state) {
            $scope.tooltip = {
                "title": "",
                "checked": false
            };
            facilitiesApi.facilities.get($state.params.fac_id)
                .success(function (one_fac) {
                    $scope.oneFacility = one_fac;
                })
                .error(function (e) {
                    $scope.alert = e.error;
                });
        }
    ]);
})(angular);
