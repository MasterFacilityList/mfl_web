(function (angular) {
    "use strict";

    angular.module("mfl.rating.routes", [])


    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
            .state("rating", {
                url: "/facility/rating/:fac_id",
                views : {
                    "header" : {
                        controller: "mfl.home.controllers.header",
                        templateUrl : "home/tpls/header.tpl.html"
                    },
                    "main" : {
                        controller: "mfl.rating.controllers.rating",
                        templateUrl: "rating/tpls/main.tpl.html"
                    },
                    "footer" : {
                        controller: "mfl.common.controllers.time",
                        templateUrl: "common/tpls/time.tpl.html"
                    }
                },
                data:{
                    pageTitle: "MFLv2 Facility Detail"
                }
            });
    }]);
})(angular);
