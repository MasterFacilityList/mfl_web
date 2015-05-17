(function (angular) {
    "use strict";

    angular.module("mflwebApp", [

        "ngAnimate",
        "ngCookies",
        "ngSanitize",
        "mflAppConfig",
        "ui.router",

        "templates-app",
        "templates-common",
        "mfl.home",
        "mfl.gis",
        "mfl.auth"
    ]);
})(angular);
