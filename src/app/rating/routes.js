(function (angular) {
    "use strict";

    angular.module("mfl.rating.routes", [
        "ui.router",
        "mfl.auth.service"
    ])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
            .state("rating", {
                url: "/facility/rating/:fac_id",
                views : {
                    "main" : {
                        controller: "mfl.rating.controllers.rating",
                        templateUrl: "rating/tpls/main.tpl.html"
                    }
                },
                data:{
                    pageTitle: "MFLv2 Facility Detail"
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

            .state("rating.services", {
                url: "/services/",
                views : {
                    "form-view@rating" : {
                        templateUrl : "rating/tpls/services.tpl.html"
                    }
                }
            })

            .state("rating.units", {
                url: "/units/",
                views : {
                    "form-view@rating" : {
                        templateUrl : "rating/tpls/units.tpl.html"
                    }
                }
            })

            .state("rating.map", {
                url: "/map/",
                views : {
                    "form-view@rating" : {
                        templateUrl : "rating/tpls/map.tpl.html",
                        controller : "mfl.rating.controllers.rating.map"
                    }
                }
            });
    }]);
})(angular);
