(function (angular){
    "use strict";
    angular
    .module("mfl.gis.routes", [])
    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
            .state("gis", {
                url: "/gis",
                views: {
                    "header" : {
                        controller: "mfl.home.controllers.header",
                        templateUrl : "home/tpls/header.tpl.html"
                    },
                    "main": {
                        controller: "mfl.gis.controllers.gis",
                        templateUrl: "gis/tpls/country-map.tpl.html"
                    },
                    "footer": {
                        controller: "mfl.common.controllers.time",
                        templateUrl: "common/tpls/time.tpl.html"
                    }
                },
                data:{
                    pageTitle: "MFLv2 Facility Geolocation"
                }
            })
            .state("gis_county", {
                url: "/county/:county_id/:const_boundaries",
                views: {
                    "header" : {
                        controller: "mfl.home.controllers.header",
                        templateUrl : "home/tpls/header.tpl.html"
                    },
                    "main": {
                        controller: "mfl.gis.controllers.gis_county",
                        templateUrl: "gis/tpls/county-map.tpl.html"
                    },
                    "footer": {
                        controller: "mfl.common.controllers.time",
                        templateUrl: "common/tpls/time.tpl.html"
                    }
                },
                resolve:{
                    gisCounty : ["gisCountiesApi","$stateParams",
                                function (gisCountiesApi, $stateParams){
                                    return gisCountiesApi.api.get($stateParams.county_id);
                                }]
                },
                data:{
                    pageTitle: "MFLv2 County View Geolocation"
                }
            })
            .state("gis_const", {
                url: "/constituency/:const_id/:ward_boundaries",
                views: {
                    "header" : {
                        controller: "mfl.home.controllers.header",
                        templateUrl : "home/tpls/header.tpl.html"
                    },
                    "main": {
                        controller: "mfl.gis.controllers.gis_const",
                        templateUrl: "gis/tpls/const-map.tpl.html"
                    },
                    "footer": {
                        controller: "mfl.common.controllers.time",
                        templateUrl: "common/tpls/time.tpl.html"
                    }
                },
                resolve:{
                    gisConst : ["gisConstsApi","$stateParams",
                                function (gisConstsApi, $stateParams){
                                    return gisConstsApi.api.get($stateParams.const_id);
                                }]
                },
                data:{
                    pageTitle: "MFLv2 Constituency View Geolocation"
                }
            }).state("gis_ward", {
                url: "/ward/:ward_id",
                views: {
                    "header" : {
                        controller: "mfl.home.controllers.header",
                        templateUrl : "home/tpls/header.tpl.html"
                    },
                    "main": {
                        controller: "mfl.gis.controllers.gis_ward",
                        templateUrl: "gis/tpls/ward-map.tpl.html"
                    },
                    "footer": {
                        controller: "mfl.common.controllers.time",
                        templateUrl: "common/tpls/time.tpl.html"
                    }
                },
                resolve:{
                    gisWard : ["gisWardsApi","$stateParams",
                                function (gisWardsApi, $stateParams){
                                    return gisWardsApi.api.get($stateParams.ward_id);
                                }]
                },
                data:{
                    pageTitle: "MFLv2 Ward View Geolocation"
                }
            });
    }]);
})(angular);