(function (angular) {
    "use strict";

    angular.module("mfl.chul.routes", ["ui.router"])

    .constant("CHU_SEARCH_PARAMS", [
        "name", "code",

        "search",

        "county", "constituency", "ward",

        "status", "facility",

        "service",

        // pagination controls
        "page_size", "page"
    ])

    .config(["$stateProvider", "CHU_SEARCH_PARAMS", function ($stateProvider, CHU_SEARCH_PARAMS) {
        $stateProvider

        .state("chul_view", {
            url: "/chul_view/:unit_id",
            views: {
                "main": {
                    controller: "mfl.chul.controllers.view",
                    templateUrl: "chul/tpls/chul_view.tpl.html"
                }
            },
            resolve: {
                "auth": ["api.auth", "$q", function (auth, $q) {
                    var current_token = auth.getToken();
                    if (current_token) {
                        return $q.when(current_token);
                    }
                    return auth.fetchToken();
                }]
            }
        })

        .state("chul_filter", {
            url: "/chul_filter?"+CHU_SEARCH_PARAMS.join("&"),
            views: {
                "main": {
                    controller: "mfl.chul.controllers.search_form",
                    templateUrl: "chul/tpls/search_form.tpl.html"
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
                filterParams: ["auth", "$stateParams", function (auth, sp) {
                    return sp;
                }]
            }
        })

        .state("chul_filter.results", {
            url: "/results",
            views: {
                "results@chul_filter": {
                    controller: "mfl.chul.controllers.search_results",
                    templateUrl: "chul/tpls/search_results.tpl.html"
                }
            }
        });
    }]);
})(window.angular);
