(function (angular) {
    "use strict";

    angular.module("mfl.home", [
        "ui.router",
        "ui.bootstrap",
        "ui.bootstrap.tpls",
        "sil-typeahead",
        "mfl.home.controllers",
        "mfl.home.routes",
        "mfl.common.controllers",
        "mfl.facilities.wrapper",
        "mfl.home.directives"
    ]);

})(angular);
