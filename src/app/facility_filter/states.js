(function (angular) {
    "use strict";

    angular.module("mfl.facility_filter.states", [
        "ui.router"
    ])

    .constant("URL_SEARCH_PARAMS", [
        "name", "code",

        "search",

        "county", "constituency", "ward",

        "operation_status", "facility_type",

        "owner_type", "owner",

        "service_category", "service",

        "number_of_beds", "number_of_cots", "open_public_holidays", "open_weekends",
        "open_whole_day", "is_regulated", "is_active",


        // pagination controls
        "page_size", "page"
    ])

    .config(["$stateProvider", "URL_SEARCH_PARAMS", function ($stateProvider, URL_SEARCH_PARAMS) {
        $stateProvider
        .state("facility_filter", {
            url: "/facility_filter?"+URL_SEARCH_PARAMS.join("&"),
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
