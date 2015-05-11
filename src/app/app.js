(function (angular) {
    "use strict";

    angular.module("mflwebApp", [

        "ngAnimate",
        "ngCookies",
        "mflAppConfig",
        "ui.router",

        "templates-app",
        "templates-common",
        "mfl.home",
        "mfl.gis",
        "ngSanitize"
    ]);
})(angular);
