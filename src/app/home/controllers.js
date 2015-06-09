"use strict";
(function(angular){
    angular.module("mfl.home.controllers", ["mfl.facilities.wrapper"])

    .controller("mfl.home.controllers.home", ["$scope", "$window",
        "searchService",
        function ($scope, $window, searchService) {
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
            $window.location = "#/filtering?search="+query;
        };
    }])

    .controller("mfl.home.controllers.header", ["$rootScope", "$scope", "$http",
        function ($rootScope, $scope, $http) {
            $scope.tooltip = {
                "title": "",
                "checked": false
            };
            $scope.stateTransition = true;

            $scope.hasPendingRequests = function () {
                return $http.pendingRequests.length > 0;
            };
            $rootScope.$on("$stateChangeStart", function () {
                $scope.stateTransition = false;
            });
            $rootScope.$on("$stateChangeSuccess", function () {
                $scope.stateTransition = true;
            });
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
