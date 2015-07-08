(function (angular) {
    "use strict";

    angular.module("mfl.facility_filter.states", [
        "ui.router"
    ])

    .config(["$stateProvider", function ($stateProvider) {
        var filterParams = [
            "search",

            "county", "constituency", "ward",

            "operation_status", "facility_type", "number_of_beds", "number_of_cots",
            "open_whole_day", "service_category", "open_whole_week",
            "owner_type", "owner",

            // pagination controls
            "page_size", "page"
        ];

        $stateProvider
        .state("facility_filter", {
            url: "/facility_filter?"+filterParams.join("&"),
            views: {
                "header" : {
                    controller: "mfl.home.controllers.header",
                    templateUrl : "home/tpls/header.tpl.html"
                },
                "main": {
                    controller: "mfl.facility_filter.controllers.form",
                    templateUrl: "facility_filter/tpls/search_form.tpl.html"
                }
            },

            // https://github.com/angular-ui/ui-router/wiki/URL-Routing#important-stateparams-gotcha
            resolve: {
                filterParams: ["$stateParams", function (sp) {
                    return sp;
                }]
            }
        })
        .state("facility_filter.results", {
            url: "/results",
            views: {
                "results@facility_filter": {
                    controller: "mfl.facility_filter.controllers.results",
                    templateUrl: "facility_filter/tpls/results.tpl.html"
                }
            }
        });
    }]);

})(angular);
