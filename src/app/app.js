"use strict";

angular.module("mflwebApp", [
    //3rd party stuff
    "ngAnimate",
    "ngCookies",
    "mflAppConfig",
    "ui.router",
    //our stuff
    "templates-app",
    "templates-common",
    "mfl.home",
    "mfl.gis",
    "ngSanitize"
])

/*Simple controller to maintain time as shown on the page footer*/
.controller("timeController", ["$scope", function ($scope) {
    $scope.time = Date.now();
}]);