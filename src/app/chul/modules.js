(function (angular) {
    "use strict";

    angular.module("mfl.chul", [
        "ui.router",
        "ui.bootstrap",
        "ui.bootstrap.tpls",
        "mfl.chul.controllers",
        "mfl.chul.routes",
        "mfl.rating.directives",
        "mfl.rating.services"
    ]);

})(window.angular);
