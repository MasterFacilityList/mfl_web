"use strict";

angular.module("mfl.common.directives")
.directive("breadcrumbs", ["$compile", function ($compile) {  //Generates breadcrumbs
    return {
        restrict: "EA",
        replace: true,
        scope:{
            path:"="
        },
        template: "<ul class='breadcrumb'></ul>",
        link: function ($scope, $element) {
            var path = "";
            _.each($scope.path, function (link) {
                path = path + "<li><a ui-sref='"+link.route+"'> "+link.name+" </a></li>";
            });
            $element.html(path);
            $compile($element)($scope);
        }
    };
}]);
