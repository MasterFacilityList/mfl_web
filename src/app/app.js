(function (angular) {
    "use strict";

    angular.module("mflwebApp", [
        "ngAnimate",
        "ngSanitize",
        "mflAppConfig",
        "ui.router",
        "anim-in-out",
        "ui.bootstrap",
        "ui.bootstrap.tpls",
        "angular-loading-bar",
        "templates-app",
        "templates-common",
        "mfl.home",
        "mfl.facility_filter",
        "mfl.chul",
        "mfl.gis",
        "mfl.auth",
        "mfl.rating",
        "mfl.downloads",
        "angulartics",
        "angulartics.google.analytics"
    ]);
})(window.angular);
