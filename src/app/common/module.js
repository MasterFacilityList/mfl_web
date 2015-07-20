(function (angular) {
    "use strict";

    angular.module("mfl.common", [
        "ui.router",
        "mfl.gis.wrapper",
        "mfl.auth",
        "mfl.common.interceptors"
    ]);
})(window.angular);
