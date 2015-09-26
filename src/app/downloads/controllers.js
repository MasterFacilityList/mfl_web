(function(angular){
    "use strict";

    angular.module("mfl.downloads.controllers", ["mfl.facilities.wrapper"])

    .controller("mfl.downloads.controllers.downloads", ["$scope",
        "facilitiesApi", function ($scope, wrappers) {
            $scope.tooltip = {
                "title": "",
                "checked": false
            };
            wrappers.documents.list()
            .success(function (data) {
                $scope.documents = data.results;
            })
            .error(function (data) {
                $scope.errors = data;
            });
        }
    ]);

})(window.angular);
