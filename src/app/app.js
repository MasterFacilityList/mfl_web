(function (angular) {
    "use strict";

    angular.module("mflwebApp", [

        "ngAnimate",
        "ngCookies",
        "mflAppConfig",
        "ui.router",
        "ngTagsInput",
        "angularjs-dropdown-multiselect",

        "templates-app",
        "templates-common",
        "mfl.home",
        "mfl.common",
        "ngSanitize",
        "mfl.filtering",
        "mfl.settings",
        "mfl.gis"
    ]);
})(angular);
