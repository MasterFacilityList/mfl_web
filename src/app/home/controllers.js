"use strict";
(function(angular){
    angular.module("mfl.home.controllers", ["mfl.facilities.wrapper"])

    .controller("mfl.home.controllers.home", ["$scope", "$state",
        "searchService",
        function ($scope, $state, searchService) {
        $scope.tooltip = {
            "title": "",
            "checked": false
        };
        $scope.typeaheadFacilities = function () {
            _.debounce(searchService.typeaheadFacilities("facilities"),
                500);
        };
        $scope.search = function (query) {
            $scope.loader = true;
            $state.go("filtering", {search: query});
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
