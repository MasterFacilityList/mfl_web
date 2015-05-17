(function (angular) {
    "use strict";

    angular.module("mfl.home.routes", [])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
            .state("home", {
                url: "/home",
                views: {
                    "main": {
                        controller: "mfl.home.controllers.home",
                        templateUrl: "home/tpls/main.tpl.html"
                    },
                    "footer": {
                        controller: "mfl.common.controllers.time",
                        templateUrl: "common/tpls/time.tpl.html"
                    }
                },
                data:{
                    pageTitle: "MFL Home"
                }
            });

    }]);

})(angular);
