"use strict";

angular.module("mfl.common.controllers", [])

/*Maintains current time for index page footer*/
    .controller("mfl.common.controllers.time", ["$scope",function ($scope) {
        $scope.time = Date.now();
    }]);