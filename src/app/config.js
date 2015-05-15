(function (angular, _) {
    "use strict";
    angular.module("mflAppConfig", [
        "ngCookies",
        "sil.grid",
        "sil.api.wrapper",
        "mfl.auth"
    ])

    .constant("SERVER_URL", "http://localhost/")

    .constant("CREDZ", {
        "email": "",
        "password": "",
        "client_id": "",
        "client_secret": "",
        "token_url": ""
    })


    .config(["SERVER_URL", "apiConfigProvider",
        function(SERVER_URL, apiConfig){
            apiConfig.SERVER_URL = SERVER_URL;
        }
    ])

    .config(["$httpProvider",function ($httpProvider) {
        $httpProvider.defaults.withCredentials = false;
        $httpProvider.defaults.headers.common = {
            "Content-Type":"application/json",
            "Accept" : "application/json, */*"
        };
    }])

    .run(["$http","$cookies", function ($http, $cookies) {
        // apparently the angular doesn"t do CSRF headers using
        // CORS across different domains thereby this hack
        var csrftoken = $cookies.csrftoken;
        var header_name = "X-CSRFToken";
        $http.defaults.headers.common[header_name] = csrftoken;
    }])

    .run(["api.auth", function (auth) {
        var token = auth.getToken();
        if (_.isNull(token)) {
            auth.fetchToken();
        }
    }])

    .config(["silGridConfigProvider", function(silGridConfig){
            silGridConfig.apiMaps = {
                    officers: ["mfl.adminunits.wrapper", "officersApi"],
                    counties: ["mfl.adminunits.wrapper", "countiesApi"],
                    constituencies: ["mfl.adminunits.wrapper", "constituenciesApi"],
                    wards: ["mfl.adminunits.wrapper", "wardsApi"],
                    towns: ["mfl.adminunits.wrapper", "townsApi"],
                    gis_countries:["mfl.gis.wrapper", "gisCountriesApi"],
                    gis_counties:["mfl.gis.wrapper", "gisCountiesApi"],
                    gis_conts:["mfl.gis.wrapper", "gisConstsApi"],
                    gis_wards:["mfl.gis.wrapper", "gisWardsApi"]
                };
            silGridConfig.appConfig = "mflAppConfig";
        }]);
})(angular, _);
