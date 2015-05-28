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
                        templateUrl: "gis/tpls/all-map.tpl.html"
                    },
                    "footer": {
                        controller: "mfl.common.controllers.time",
                        templateUrl: "common/tpls/time.tpl.html"
                    },
                    "info@gis":{
                        templateUrl: "gis/tpls/country-info.tpl.html"
                    },
                    "map@gis":{
                        templateUrl:"gis/tpls/country-leaflet.tpl.html"
                    }
                },
                data:{
                    pageTitle: "MFLv2 Facility Geolocation"
                }
            })
            .state("gis.gis_county", {
                url: "/:county_id/:const_boundaries",
                views: {
                    "info@gis":{
                        controller:"mfl.gis.controllers.gis_county",
                        templateUrl: "gis/tpls/info.tpl.html"
                    },
                    "map@gis":{
                        controller:"mfl.gis.controllers.gis_county",
                        templateUrl:"gis/tpls/county-leaflet.tpl.html"
                    },
                    "area@gis.gis_county":{
                        controller:"mfl.gis.controllers.gis_county",
                        templateUrl:"gis/tpls/county-info.tpl.html"
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
            .state("gis.gis_county.gis_const", {
                url: "/:const_id/:ward_boundaries",
                views: {
                    "area@gis.gis_county":{
                        controller:"mfl.gis.controllers.gis_const",
                        templateUrl: "gis/tpls/const-info.tpl.html"
                    },
                    "map@gis":{
                        controller:"mfl.gis.controllers.gis_const",
                        templateUrl:"gis/tpls/const-leaflet.tpl.html"
                    },
                    "const-link@gis.gis_county":{
                        controller:"mfl.gis.controllers.gis_const",
                        templateUrl:"gis/tpls/const-link.tpl.html"
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
            }).state("gis.gis_county.gis_const.gis_ward", {
                url: "/ward/:ward_id",
                views: {
                    "area@gis.gis_county":{
                        controller:"mfl.gis.controllers.gis_ward",
                        templateUrl: "gis/tpls/ward-info.tpl.html"
                    },
                    "map@gis":{
                        controller:"mfl.gis.controllers.gis_ward",
                        templateUrl:"gis/tpls/ward-leaflet.tpl.html"
                    },
                    "ward-link@gis.gis_county":{
                        controller:"mfl.gis.controllers.gis_ward",
                        templateUrl:"gis/tpls/ward-link.tpl.html"
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