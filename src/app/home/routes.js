(function (angular) {
    "use strict";

    angular.module("mfl.home.routes", ["ui.router"])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
            .state("home", {
                url: "/home",
                views: {
                    "header" : {
                        controller: "mfl.home.controllers.header",
                        templateUrl : "home/tpls/header.tpl.html"
                    },
                    "main": {
                        controller: "mfl.home.controllers.home",
                        templateUrl: "home/tpls/main.tpl.html"
                    },
                    "main-view@home": {
                        controller: "mfl.home.controllers.home",
                        templateUrl: "home/tpls/main_landing.tpl.html"
                    },
                    "footer": {
                        controller: "mfl.common.controllers.time",
                        templateUrl: "common/tpls/time.tpl.html"
                    }
                },
                data:{
                    pageTitle: "MFLv2 Home"
                }
            })
            .state("search_results", {
                url: "/searchresults/:result",
                views: {
                    "header" : {
                        controller: "mfl.home.controllers.header",
                        templateUrl : "home/tpls/header.tpl.html"
                    },
                    "main": {
                        controller: "mfl.home.controllers.search_results",
                        templateUrl: "home/tpls/search_results.tpl.html"
                    },
                    "footer": {
                        controller: "mfl.common.controllers.time",
                        templateUrl: "common/tpls/time.tpl.html"
                    }
                },
                data:{
                    pageTitle: "MFLv2 Search Results"
                }
            
            })
            .state("facility_details", {
                url : "/facility/:fac_id",
                views: {
                    "header" : {
                        controller: "mfl.home.controllers.header",
                        templateUrl : "home/tpls/header.tpl.html"
                    },
                    "main": {
                        controller: "mfl.home.controllers.facility_details",
                        templateUrl: "home/tpls/facility_details.tpl.html"
                    },
                    "footer": {
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
