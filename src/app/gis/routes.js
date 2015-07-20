(function (angular){
    "use strict";
    angular
    .module("mfl.gis.routes", [])
    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
            .state("gis", {
                url: "/gis",
                views: {
                    "main": {
                        controller: "mfl.gis.controllers.gis",
                        templateUrl: "gis/tpls/all-map.tpl.html"
                    },
                    "info-map@gis":{
                        templateUrl:"gis/tpls/country-map-info.tpl.html"
                    }
                },
                data:{
                    pageTitle: "MFLv2 Facility Geolocation",
                    back: false
                }
            })
            .state("gis.gis_county", {
                url: "/:county_id/:const_boundaries",
                views: {
                    "info-map@gis":{
                        controller:"mfl.gis.controllers.gis_county",
                        templateUrl: "gis/tpls/county-map-info.tpl.html"
                    }
                },
                resolve:{
                    gisCounty : ["gisAdminUnitsApi","$stateParams",
                                function (gisAdminUnitsApi, $stateParams){
                                    return gisAdminUnitsApi.counties.get($stateParams.county_id);
                                }]
                },
                data:{
                    pageTitle: "MFLv2 County View Geolocation",
                    back: true

                }
            })
            .state("gis.gis_county.gis_const", {
                url: "/:const_id/:ward_boundaries",
                views: {
                    "info-map@gis":{
                        controller:"mfl.gis.controllers.gis_const",
                        templateUrl: "gis/tpls/const-map-info.tpl.html"
                    }
                },
                resolve:{
                    gisConst : ["gisAdminUnitsApi","$stateParams",
                                function (gisAdminUnitsApi, $stateParams){
                                    return gisAdminUnitsApi.constituencies.get(
                                        $stateParams.const_id
                                    );
                                }]
                },
                data:{
                    pageTitle: "MFLv2 Constituency View Geolocation",
                    back: true
                }
            }).state("gis.gis_county.gis_const.gis_ward", {
                url: "/ward/:ward_id",
                views: {
                    "info-map@gis":{
                        controller:"mfl.gis.controllers.gis_ward",
                        templateUrl: "gis/tpls/ward-map-info.tpl.html"
                    }
                },
                resolve:{
                    gisWard : ["gisAdminUnitsApi","$stateParams",
                                function (gisAdminUnitsApi, $stateParams){
                                    return gisAdminUnitsApi.wards.get($stateParams.ward_id);
                                }]
                },
                data:{
                    pageTitle: "MFLv2 Ward View Geolocation",
                    back: true
                }
            });
    }]);
})(window.angular);
