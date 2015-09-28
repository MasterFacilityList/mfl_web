(function (angular) {
    "use strict";

    angular.module("mfl.downloads.routes", ["ui.router"])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
            .state("downloads", {
                url: "/downloads",
                views: {
                    "main": {
                        controller: "mfl.downloads.controllers.downloads",
                        templateUrl: "downloads/tpls/main.tpl.html"
                    }
                },
                data:{
                    pageTitle: "MFLv2 Downloads"
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
            });
    }]);
})(window.angular);
