(function (angular) {
    "use strict";

    angular.module("mfl.rating", [
        //3rd party stuff
        "ui.router",
        "ui.bootstrap",
        "ui.bootstrap.tpls",
        //our stuff
        "mfl.rating.controllers",
        "mfl.rating.routes",
        "mfl.common.controllers",
        "mfl.facilities.wrapper",
        "mfl.rating.directives"
    ]);
})(angular);

