"use strict";

angular.module("mfl.common.directives")
.directive("silContTitle", ["$compile", function ($compile) {  //Generates title
    return {
        restrict: "E",
        replace: true,
        template: "<span class='main-title'></span>",
        link: function ($scope, $element) {
            var title = "";
            _.each($scope.title, function (link) {
                title = title + "<i class='sidebar-icon fa "+
                    link.icon + "'> </i> " + link.name;
            });
            $element.html(title);
            $compile($element)($scope);
        }
    };
}]);
