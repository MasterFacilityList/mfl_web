(function (angular) {
    "use strict";

    angular.module("mflwebApp", [

        "ngAnimate",
        "ngCookies",
        "ngSanitize",
        "mflAppConfig",
        "ui.router",
        "ngTagsInput",
        "angularjs-dropdown-multiselect",

        "templates-app",
        "templates-common",
        "mfl.home",
        "mfl.filtering",
        "mfl.gis",
        "mfl.auth"
    ]);
})(angular);
