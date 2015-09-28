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
                    "back@gis":{
                        templateUrl:"gis/tpls/history_back.tpl.html"
                    },
                    "info-map@gis":{
                        templateUrl:"gis/tpls/country-map-info.tpl.html"
                    }
                },
                data:{
                    pageTitle: "MFLv2 Facility Geolocation"
                },
                resolve: {
                    "auth": ["api.auth", "$q", function (auth, $q) {
                        var current_token = auth.getToken();
                        if (current_token) {
                            return $q.when(current_token);
                        }
                        return auth.fetchToken();
                    }],
                    filterParams: ["auth", "$stateParams", function (auth, sp) {
                        return sp;
                    }]
                }
            })
            .state("gis.gis_county", {
                url: "/:county_id/:const_boundaries",
                views: {
                    "back@gis":{
                        templateUrl:"gis/tpls/state_back.tpl.html"
                    },
                    "info-map@gis":{
                        controller:"mfl.gis.controllers.gis_county",
                        templateUrl: "gis/tpls/county-map-info.tpl.html"
                    }
                },
                data:{
                    pageTitle: "MFLv2 County View Geolocation"
                }
            })
            .state("gis.gis_county.gis_const", {
                url: "/:const_id/:ward_boundaries",
                views: {
                    "back@gis":{
                        templateUrl:"gis/tpls/history_back.tpl.html"
                    },
                    "info-map@gis":{
                        controller:"mfl.gis.controllers.gis_const",
                        templateUrl: "gis/tpls/const-map-info.tpl.html"
                    }
                },
                data:{
                    pageTitle: "MFLv2 Constituency View Geolocation"
                }
            }).state("gis.gis_county.gis_const.gis_ward", {
                url: "/ward/:ward_id",
                views: {
                    "back@gis":{
                        templateUrl:"gis/tpls/history_back.tpl.html"
                    },
                    "info-map@gis":{
                        controller:"mfl.gis.controllers.gis_ward",
                        templateUrl: "gis/tpls/ward-map-info.tpl.html"
                    }
                },
                data:{
                    pageTitle: "MFLv2 Ward View Geolocation"
                }
            });
    }]);
})(window.angular);
