"use strict";

angular.module("mfl.common.services", [])

    .service("mfl.common.services.localStorage", [function () {
        this.getItem = function (key) {
            return JSON.parse(localStorage.getItem(key));
        };
        this.setItem = function (key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        };
        this.removeItem = function (key) {
            localStorage.removeItem(key);
        };
        this.dumpScope = function (scope, location) {
            var dump = {
                location : location,
                scope : (_.isUndefined(scope.data) || _.isNull(scope.data)) ? {} : scope.data
            };
            this.setItem("dump", dump);
        };
        this.loadScope = function () {
            this.getItem("dump");
        };
        this.clear = function () {
            localStorage.clear();
        };
        return;
    }]);