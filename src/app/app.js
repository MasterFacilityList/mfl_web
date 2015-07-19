(function (angular) {
    "use strict";

    angular.module("mflwebApp", [
        "ngAnimate",
        "ngSanitize",
        "mflAppConfig",
        "ui.router",
        "ui.bootstrap",
        "ui.bootstrap.tpls",
        "angular-loading-bar",
        "templates-app",
        "templates-common",
        "mfl.home",
        "mfl.facility_filter",
        "mfl.gis",
        "mfl.auth",
        "mfl.rating"
    ]);
})(angular);
