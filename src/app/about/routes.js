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
            })
            .state("about.facilities", {
                url: "/facilities/",
                views: {
                    "form-view@about" : {
                        templateUrl: "about/tpls/facilities.tpl.html"
                    }
                }
            })
            .state("about.chus", {
                url: "/community_units/",
                views: {
                    "form-view@about" : {
                        templateUrl: "about/tpls/chus.tpl.html"
                    }
                }
            });
    }]);
})(window.angular);
