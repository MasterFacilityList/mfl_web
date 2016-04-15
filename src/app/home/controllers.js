(function(angular, _) {
    "use strict";

    angular.module("mfl.home.controllers", [
        "mfl.facilities.wrapper",
        "mfl.common.typeahead"
    ])

    .controller("mfl.home.controllers.home", ["$scope",
        "searchService", "$state", "facilitiesApi",
        function ($scope, searchService, $state) {
            $scope.spinner = true;
            $scope.service_mode = "Facilities";

            $scope.isFocused = false;
            $scope.chu_mode = false;

            $scope.typeaheadFacilities = function () {
                $scope.chu_mode = false;
                $scope.service_mode = "Facilities";
                searchService.destroyTT("facilities");
                $scope.isFocused = !$scope.isFocused;
                _.debounce(searchService.typeaheadFacilities("facilities"), 300);
            };

            $scope.typeaheadCHUs = function () {
                $scope.chu_mode = true;
                $scope.service_mode = "Community Health Units";
                searchService.destroyTT("facilities");
                $scope.isFocused = !$scope.isFocused;
                _.debounce(searchService.typeaheadCHUs("facilities"), 300);
            };

            $scope.set_search_mode =  function(){
                $scope.service_mode = "Services";
                return $scope.service_mode;
            };

            $scope.search = function (query) {
                $scope.loader = true;
                if ($scope.service_mode==="Community Health Units") {
                    $state.go("chul_filter.results", {"search" : query});
                }
                if($scope.service_mode==="Facilities"){
                    $state.go("facility_filter.results", {"search" : query});
                }
                if($scope.service_mode==="Services"){
                    $state.go("facility_filter.results", {"service_name" : query});
                }
            };

        }
    ]);

})(window.angular, window._);
