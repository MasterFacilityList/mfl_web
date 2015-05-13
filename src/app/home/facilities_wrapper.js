"use strict";

angular.module("mfl.facilities.wrapper", ["sil.api.wrapper", "mfl.settings"])

    .service("facilitiesApi", ["api", function (api) {
        this.facilities = api.setBaseUrl("api/facilities/facilities/");
        this.services = api.setBaseUrl("api/facilities/services");
    }])
    .service("downloadApi", ["$http", "SERVER_URL", function ($http, SERVER_URL) {
        var request_uri = SERVER_URL;
        var url = "api/common/download/download/xlsx/";
        this.downLoad = function () {
            return $http.get(request_uri + url);
        };
    }]);
