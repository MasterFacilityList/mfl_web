"use strict";
(function(angular){
    angular.module("mfl.filtering.routes", [])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
        .state("filtering", {
                url: "/filtering",
                views: {
                    "main": {
                        controller: "mfl.filtering.controller",
                        templateUrl: "advanced_search/tpls/advanced_search.tpl.html"
                    }
                }
            });
    }]);
})(angular);
