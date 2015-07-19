(function (angular) {
    "use strict";

    angular.module("mfl.home.routes", ["ui.router"])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
            .state("home", {
                url: "/home",
                views: {
                    "main": {
                        controller: "mfl.home.controllers.home",
                        templateUrl: "home/tpls/main.tpl.html"
                    }
                },
                data:{
                    pageTitle: "MFLv2 Home"
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
})(angular);
