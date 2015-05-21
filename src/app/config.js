(function (angular) {
    "use strict";
    angular.module("mflAppConfig", [
        "ui.router",
        "ngCookies",
        "sil.grid",
        "sil.api.wrapper",
        "mfl.gis.interceptor"
    ])

    .constant("SERVER_URL", window.MFL_SETTINGS.SERVER_URL)

    .constant("CREDZ", window.MFL_SETTINGS.CREDZ)

    .config(["$urlRouterProvider", function ($urlRouterProvider) {
        $urlRouterProvider.otherwise("/home");
    }])

    .config(["SERVER_URL", "apiConfigProvider",
        function(SERVER_URL, apiConfig){
            apiConfig.SERVER_URL = SERVER_URL;
        }
    ])

    .config(["$httpProvider",function ($httpProvider) {
        $httpProvider.interceptors.push("mfl.gis.interceptor.headers");
        $httpProvider.defaults.withCredentials = false;
        $httpProvider.defaults.headers.common = {
            "Content-Type":"application/json",
            "Accept" : "application/json, */*"
        };
    }])
    
    .run(["$http","$cookies","$rootScope","$state","$stateParams",
          function ($http, $cookies,$rootScope,$state,$stateParams) {
        // apparently the angular doesn"t do CSRF headers using
        // CORS across different domains thereby this hack
        var csrftoken = $cookies.csrftoken;
        var header_name = "X-CSRFToken";
        $http.defaults.headers.common[header_name] = csrftoken;
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
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
})(angular);
