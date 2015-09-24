(function(angular){
    "use strict";

    angular.module("mfl.chul.controllers", ["mfl.chul.services"])

    .controller("mfl.chul.controllers.list", ["$scope","mfl.chul.services.wrappers",
        function ($scope,wrappers) {
            $scope.tooltip = {
                "title": "",
                "checked": false
            };
            $scope.spinner = true;
            wrappers.chul.list()
            .success(function (data) {
                $scope.spinner = false;
                $scope.results = data;
            })
            .error(function (error) {
                $scope.spinner = false;
                $scope.alert = error;
            });
        }
    ])
    .controller("mfl.chul.controllers.view", ["$scope","mfl.chul.services.wrappers","$stateParams",
        function ($scope,wrappers,$stateParams) {
            $scope.tooltip = {
                "title": "",
                "checked": false
            };
            $scope.spinner = true;
            wrappers.chul.get($stateParams.unit_id)
            .success(function (data) {
                $scope.spinner = false;
                $scope.unit = data;
            })
            .error(function (error) {
                $scope.spinner = false;
                $scope.alert = error;
            });
        }
    ]);

})(window.angular);
