(function (angular) {
    "use strict";

    angular.module("mfl.rating.routes", [])


    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
            .state("rating", {
                url: "facility/rating/:fac_id",
                views : {
                    "main" : {
                        controller: "mfl.rating.controllers.rating",
                        templateUrl: "rating/tpls/main.tpl.html"
                    },
                    "footer" : {
                        controller: "mfl.common.controllers.time",
                        templateUrl: "common/tpls/time.tpl.html"
                    }
                }
            });
    }]);
})(angular);
