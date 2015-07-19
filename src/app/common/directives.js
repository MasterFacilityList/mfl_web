(function (angular, jQuery) {
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
                        jQuery(".content").removeClass("left-col-hidden");
                        jQuery("#mini i").removeClass("fa-chevron-circle-right");
                        jQuery("#mini i").addClass("fa-chevron-circle-left");
                    } else {
                        $rootScope.offsetClass = "left-col-hidden";
                        jQuery(".content").addClass("left-col-hidden");
                        jQuery("#mini i").removeClass("fa-chevron-circle-left");
                        jQuery("#mini i").addClass("fa-chevron-circle-right");
                    }
                });
            }
        };
    }]);

})(window.angular, window.jQuery);
