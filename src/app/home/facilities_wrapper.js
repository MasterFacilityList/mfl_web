"use strict";

angular.module("mfl.facilities.wrapper", ["sil.api.wrapper"])

    .service("facilitiesApi", function () {
        this.facilities = api.setBaseUrl("api/facilities/facilities/");
        this.services = api.setBaseUrl("api/facilities/services");

    });
