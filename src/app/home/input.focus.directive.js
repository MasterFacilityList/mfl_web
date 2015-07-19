(function (angular) {
    "use strict";
    angular.module("mfl.home.directives", [])
    .directive("syncFocusWith", [function() {
        return {
            restrict: "A",
            scope: {
                focusValue: "=syncFocusWith"
            },
            link: function($scope, $element) {
                $scope.$watch("focusValue", function(currentValue, previousValue) {
                    if (currentValue === true && !previousValue) {
                        $element[0].focus();
                    } else if (currentValue === false && previousValue) {
                        $element[0].blur();
                    }
                });
            }
        };
    }]);
})(window.angular);
