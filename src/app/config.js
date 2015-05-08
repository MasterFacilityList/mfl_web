"use strict";
angular.module("mflAppConfig", ["ngCookies",
    "sil.grid", "mfl.settings", "mfl.common.providers"])
    .config(["$httpProvider",function ($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.headers.common = {
            "Content-Type":"application/json",
            "Accept" : "application/json, */*"
        };
        //$httpProvider.interceptors.push("sessionInjector");
        /*$httpProvider.interceptors.push(""sessionInjector"");
        $httpProvider.interceptors.push("api.http.interceptor");
        $httpProvider.interceptors.push("api.connection.interceptor");*/

    }])

    //beginning of configuring interceptor
    .config(function($httpProvider) {
        $httpProvider.interceptors.push("myCSRF");
    })

    .run(["$http","$cookies", function ($http, $cookies) {
        // apparently the angular doesn"t do CSRF headers using
        // CORS across different domains thereby this hack
        var csrftoken = $cookies.csrftoken;
        var header_name = "X-CSRFToken";
        $http.defaults.headers.common[header_name] = csrftoken;
        $.ajaxSetup({
            xhrFields: {
                withCredentials: true
            }
        });
    }])

    .config(["silGridConfigProvider", function(silGridConfig){
            silGridConfig.apiMaps = {
                    practitioners: ["mfl.practitioners.wrapper", "practitionersApi"],
                    facilities : ["mfl.facilities.wrapper",
                        "facilitiesApi"],
                    chul: ["mfl.chul.wrapper", "chulApi"],
                    officers: ["mfl.adminunits.wrapper", "officersApi"],
                    counties: ["mfl.adminunits.wrapper", "countiesApi"],
                    constituencies: ["mfl.adminunits.wrapper", "constituenciesApi"],
                    wards: ["mfl.adminunits.wrapper", "wardsApi"],
                    towns: ["mfl.adminunits.wrapper", "townsApi"],
                    owners: ["mfl.facilities.wrapper", "ownersApi"],
                    gis_countries:["mfl.gis.wrapper", "gisCountriesApi"],
                    gis_counties:["mfl.gis.wrapper", "gisCountiesApi"],
                    gis_conts:["mfl.gis.wrapper", "gisConstsApi"],
                    gis_wards:["mfl.gis.wrapper", "gisWardsApi"]
                };
            silGridConfig.appConfig = "mflAppConfig";
        }]);
