(function (angular) {
    "use strict";

    angular.module("mfl.facility_filter.states", [
        "ui.router",
        "mfl.auth.service"
    ])

    .constant("FACILITY_SEARCH_PARAMS", [
        "name", "code",

        "search", "sub_county",

        "county", "constituency", "ward",

        "operation_status", "facility_type", "keph_level",

        "owner_type", "owner",

        "service_category", "service", "service_name",

        "number_of_beds", "number_of_cots",
        "open_public_holidays", "open_weekends", "open_whole_day",

        // pagination controls
        "page_size", "page"
    ])

    .config(["$stateProvider", "FACILITY_SEARCH_PARAMS", function ($stateProvider,
            FACILITY_SEARCH_PARAMS) {
        $stateProvider
        .state("facility_filter", {
            url: "/facility_filter?"+FACILITY_SEARCH_PARAMS.join("&"),
            views: {
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

})(window.angular);
