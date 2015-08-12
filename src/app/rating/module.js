(function (angular) {
    "use strict";

    angular.module("mfl.rating", [
        "ui.router",
        "mfl.rating.controllers",
        "mfl.rating.routes",
        "mfl.rating.services",
        "mfl.facilities.wrapper",
        "mfl.rating.directives"
    ]);

})(window.angular);
