"use strict";
angular.module("mfl.home.routes", [])

    .config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
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
                    pageTitle: "MFL Home"
                }
            })
            .state("home.search_results", {
                url: "/searchresults/:result",
                views: {
                    "main-view@home": {
                        controller: "mfl.home.controllers.search_results",
                        templateUrl: "home/tpls/search_results.tpl.html"
                    }
                }
            })
            .state("home.facility_details", {
                url : "/facility/:fac_id",
                views: {
                    "main-view@home": {
                        controller: "mfl.home.controllers.facility_details",
                        templateUrl: "home/tpls/facility_details.tpl.html"
                    }
                }
            });
        $urlRouterProvider.otherwise("/home");
    }])
    .run([ "$rootScope", "$state", "$stateParams",
        function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }]);
