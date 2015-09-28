(function (angular) {
    "use strict";

    angular.module("mfl.about.routes", ["ui.router"])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
            .state("about", {
                url: "/about",
                views: {
                    "main": {
                        controller: "mfl.about.controllers.about",
                        templateUrl: "about/tpls/main.tpl.html"
                    }
                },
                data:{
                    pageTitle: "MFLv2 About"
                }
            });
    }]);
})(window.angular);
