(function (angular) {
    "use strict";

    angular.module("mflwebApp", [

        "ngAnimate",
        "ngCookies",
        "ngSanitize",
        "mflAppConfig",
        "ui.router",
        "ui.bootstrap",
        "ui.bootstrap.tpls",

        "templates-app",
        "templates-common",
        "mfl.home",
        "mfl.gis",
        "mfl.auth",
        "mfl.rating"
    ]);
})(angular);
