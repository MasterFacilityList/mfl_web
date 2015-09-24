(function (angular) {
    "use strict";

    angular.module("mfl.chul.routes", ["ui.router"])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
            .state("chul", {
                url: "/chul",
                views: {
                    "main": {
                        controller: "mfl.chul.controllers.list",
                        templateUrl: "chul/tpls/chul_list.tpl.html"
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
            .state("chul_view", {
                url: "/view/:unit_id",
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
            });
    }]);
})(window.angular);
