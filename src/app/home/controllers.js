(function(angular, _) {
    "use strict";

    angular.module("mfl.home.controllers", [
        "mfl.facilities.wrapper",
        "mfl.common.typeahead"
    ])

    .controller("mfl.home.controllers.home", ["$scope",
        "searchService", "$state", "facilitiesApi",
        function ($scope, searchService, $state, wrappers) {
            $scope.spinner = true;
            wrappers.chul_services.filter({"fields":"name,description"})
            .success(function (data) {
                $scope.services = data.results;
                $scope.spinner = false;
            })
            .error(function (data) {
                $scope.errors = data;
                $scope.spinner = false;
            });
            $scope.isFocused = false;
            $scope.chu_mode = false;

            $scope.typeaheadFacilities = function () {
                $scope.chu_mode = false;
                searchService.destroyTT("facilities");
                $scope.isFocused = !$scope.isFocused;
                _.debounce(searchService.typeaheadFacilities("facilities"), 300);
            };

            $scope.typeaheadCHUs = function () {
                $scope.chu_mode = true;
                searchService.destroyTT("facilities");
                $scope.isFocused = !$scope.isFocused;
                _.debounce(searchService.typeaheadCHUs("facilities"), 300);
            };

            $scope.search = function (query) {
                $scope.loader = true;
                if ($scope.chu_mode) {
                    $state.go("chul_filter.results", {"search" : query});
                } else {
                    $state.go("facility_filter.results", {"search" : query});
                }
            };

        }
    ]);

})(window.angular, window._);
