(function(angular){
    "use strict";

    angular.module("mfl.about.controllers", ["mfl.facilities.wrapper"])

    .controller("mfl.about.controllers.about", ["$scope",
        "facilitiesApi", function ($scope, wrappers) {
            $scope.tooltip = {
                "title": "",
                "checked": false
            };
            $scope.spinner = true;
            wrappers.chul_services.list()
            .success(function (data) {
                $scope.services = data.results;
                $scope.spinner = false;
            })
            .error(function (data) {
                $scope.errors = data;
                $scope.spinner = false;
            });
        }
    ]);

})(window.angular);
