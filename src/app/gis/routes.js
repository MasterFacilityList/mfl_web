"use strict";
angular.module("mfl.gis.routes", [])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
            .state("gis", {
                url: "/gis",
                views: {
                    "main": {
                        controller: "mfl.gis.controllers.gis",
                        templateUrl: "gis/tpls/index.tpl.html"
                    }
                },
                data:{
                    pageTitle: "MFL Country"
                }
            })
            .state("gis.county", {
                url: "/county",
                views: {
                    "main@gis": {
                        controller: "mfl.gis.controllers.gis.county",
                        templateUrl: "gis/tpls/county-map.tpl.html"
                    }
                },
                data:{
                    pageTitle: "MFL County"
                }
            });
    }]);
