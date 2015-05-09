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
                    },
                    "footer": {
                        controller: "mfl.common.controllers.time",
                        templateUrl: "common/tpls/time.tpl.html"
                    }
                },
                data:{
                    pageTitle: "MFL KENYA"
                }
            })
            .state("gis_county", {
                url: "/county/:county_id",
                views: {
                    "main": {
                        controller: "mfl.gis.controllers.gis_county",
                        templateUrl: "gis/tpls/county-map.tpl.html"
                    },
                    "footer": {
                        controller: "mfl.common.controllers.time",
                        templateUrl: "common/tpls/time.tpl.html"
                    }
                },
                data:{
                    pageTitle: "MFL County"
                }
            }).state("gis_contituency", {
                url: "/constituency/:constituency_id",
                views: {
                    "main": {
                        controller: "mfl.gis.controllers.gis_const",
                        templateUrl: "gis/tpls/const-map.tpl.html"
                    },
                    "footer": {
                        controller: "mfl.common.controllers.time",
                        templateUrl: "common/tpls/time.tpl.html"
                    }
                },
                data:{
                    pageTitle: "MFL Constituency"
                }
            }).state("gis_ward", {
                url: "/ward/:ward_id",
                views: {
                    "main": {
                        controller: "mfl.gis.controllers.gis_ward",
                        templateUrl: "gis/tpls/ward-map.tpl.html"
                    },
                    "footer": {
                        controller: "mfl.common.controllers.time",
                        templateUrl: "common/tpls/time.tpl.html"
                    }
                },
                data:{
                    pageTitle: "MFL Ward"
                }
            });
    }]);
