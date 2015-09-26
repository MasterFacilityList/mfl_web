(function (angular) {
    "use strict";

    angular.module("mfl.downloads.routes", ["ui.router"])

    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
            .state("downloads", {
                url: "/downloads",
                views: {
                    "main": {
                        controller: "mfl.downloads.controllers.downloads",
                        templateUrl: "downloads/tpls/main.tpl.html"
                    }
                },
                data:{
                    pageTitle: "MFLv2 Downloads"
                }
            });
    }]);
})(window.angular);
