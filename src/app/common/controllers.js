(function (angular) {
    "use strict";

    angular.module("mfl.common.controllers", [])

    /* Maintains current year for index page footer*/
    .controller("mfl.common.controllers.time", ["$scope",function ($scope) {
        $scope.time = Date.now();
    }]);

})(angular);
