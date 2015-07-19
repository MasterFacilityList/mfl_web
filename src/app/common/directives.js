(function (angular) {
    "use strict";

    angular.module("mfl.common.directives", [])

    .directive("sidebarToogle", ["$rootScope", function ($rootScope) {
        return{
            restrict: "A",
            replace: false,
            link: function ($scope, element) {
                element.bind("click", function() {
                    if ($rootScope.offsetClass) {
                        $rootScope.offsetClass = "";
                        $(".content").removeClass("left-col-hidden");
                        $("#mini i").removeClass("fa-chevron-circle-right");
                        $("#mini i").addClass("fa-chevron-circle-left");
                    } else {
                        $rootScope.offsetClass = "left-col-hidden";
                        $(".content").addClass("left-col-hidden");
                        $("#mini i").removeClass("fa-chevron-circle-left");
                        $("#mini i").addClass("fa-chevron-circle-right");
                    }
                });
            }
        };
    }]);


})(angular);
