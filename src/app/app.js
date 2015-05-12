(function (angular) {
    "use strict";

    angular.module("mflwebApp", [

        "ngAnimate",
        "ngCookies",
        "mflAppConfig",
        "ui.router",
        "ui.select",

        "templates-app",
        "templates-common",
        "mfl.home",
        "mfl.common",
        "ngSanitize",
        "mfl.filtering",
        "mfl.settings"
    ]);
})(angular);
