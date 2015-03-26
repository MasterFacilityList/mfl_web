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
                data : { pageTitle: "Home" }
            });
        $urlRouterProvider.otherwise("/home");
    }]);
