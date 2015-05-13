"use strict";
(function(angular){
    var filterParams = [
        "search", "county", "constituency", "ward", "operation_status",
        "facility_type", "number_of_beds", "number_of_cots", "open_whole_day",
        "is_classified", "is_published", "is_regulated", "is_active"
    ];
    angular.module("mfl.filtering.routes", [])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
        .state("filtering", {
                url: "/filtering?"+filterParams.join("&"),
                views: {
                    "main": {
                        controller: "mfl.filtering.controller",
                        templateUrl: "advanced_search/tpls/advanced_search.tpl.html"
                    }
                }
            });
    }]);
})(angular);
