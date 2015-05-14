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
                    },
                    "header" : {
                        controller: "mfl.home.controllers.header",
                        templateUrl : "home/tpls/header.tpl.html"
                    },
                    "main-view@home": {
                        controller: "mfl.home.controllers.home",
                        templateUrl: "home/tpls/main_landing.tpl.html"
                    },
                    "footer": {
                        controller: "mfl.common.controllers.time",
                        templateUrl: "common/tpls/time.tpl.html"
                    }
                }
            });
    }]);
})(angular);
