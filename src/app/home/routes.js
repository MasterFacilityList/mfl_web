"use strict";
angular.module("mfl.home.routes", [])

    .config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
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
                    pageTitle: "MFL Home"
                }
            });
        $urlRouterProvider.otherwise("/home");
    }])
    .run([ "$rootScope", "$state", "$stateParams",
        function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }]);
