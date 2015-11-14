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
                resolve: {
                    "auth": ["api.auth", "$q", function (auth, $q) {
                        var current_token = auth.getToken();
                        if (current_token) {
                            return $q.when(current_token);
                        }
                        return auth.fetchToken();
                    }]
                }
            })
            .state("gis_county", {
                url: "/gis/{county_code:int}/",
                views: {
                    "main": {
                        templateUrl: "gis/tpls/all-map.tpl.html"
                    },
                    "back@gis_county":{
                        templateUrl:"gis/tpls/state_back.tpl.html"
                    },
                    "info-map@gis_county":{
                        controller:"mfl.gis.controllers.gis_county",
                        templateUrl: "gis/tpls/county-map-info.tpl.html"
                    }
                },
                resolve: {
                    "auth": ["api.auth", "$q", function (auth, $q) {
                        var current_token = auth.getToken();
                        if (current_token) {
                            return $q.when(current_token);
                        }
                        return auth.fetchToken();
                    }]
                }
            })
            .state("gis_county.gis_const", {
                url: "{constituency_code:int}/",
                views: {
                    "back@gis_county":{
                        templateUrl:"gis/tpls/history_back.tpl.html"
                    },
                    "info-map@gis_county":{
                        controller:"mfl.gis.controllers.gis_const",
                        templateUrl: "gis/tpls/const-map-info.tpl.html"
                    }
                }
            }).state("gis_county.gis_const.gis_ward", {
                url: "{ward_code:int}/",
                views: {
                    "back@gis_county":{
                        templateUrl:"gis/tpls/history_back.tpl.html"
                    },
                    "info-map@gis_county":{
                        controller:"mfl.gis.controllers.gis_ward",
                        templateUrl: "gis/tpls/ward-map-info.tpl.html"
                    }
                }
            });
    }]);
})(window.angular);
