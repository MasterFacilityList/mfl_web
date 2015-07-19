(function(angular, _){
    "use strict";

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
        }
    ]);

})(window.angular, window._);
