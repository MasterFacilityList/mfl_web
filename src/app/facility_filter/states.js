(function (angular) {
    "use strict";

    angular.module("mfl.facility_filter.states", [
        "ui.router",
        "mfl.auth.service"
    ])

    .constant("URL_SEARCH_PARAMS", [
        "name", "code",

        "search",

        "county", "constituency", "ward",

        "operation_status", "facility_type",

        "owner_type", "owner",

        "service_category", "service",

        "number_of_beds", "number_of_cots",
        "open_public_holidays", "open_weekends", "open_whole_day",

        // pagination controls
        "page_size", "page"
    ])

    .config(["$stateProvider", "URL_SEARCH_PARAMS", function ($stateProvider, URL_SEARCH_PARAMS) {
        $stateProvider
        .state("facility_filter", {
            url: "/facility_filter?"+URL_SEARCH_PARAMS.join("&"),
            views: {
                "header" : {
                    templateUrl : "home/tpls/header.tpl.html"
                },
                "main": {
                    controller: "mfl.facility_filter.controllers.form",
                    templateUrl: "facility_filter/tpls/search_form.tpl.html"
                }
            },

            resolve: {
                "auth": ["api.auth", "$q", function (auth, $q) {
                    var current_token = auth.getToken();
                    if (current_token) {
                        return $q.when(current_token);
                    }
                    return auth.fetchToken();
                }],
                // github.com/angular-ui/ui-router/wiki/URL-Routing#important-stateparams-gotcha
                filterParams: ["auth", "$stateParams", function (auth, sp) {
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
