(function (angular) {
    "use strict";

    angular.module("mfl.home", [
        "ui.router",
        "ui.bootstrap",
        "ui.bootstrap.tpls",
        "mfl.common.typeahead",
        "mfl.home.controllers",
        "mfl.home.routes",
        "mfl.facilities.wrapper",
        "mfl.home.directives"
    ]);

})(window.angular);
