"use strict";

angular.module("mfl.common.directives")
.directive("contentheader", [ function () {
    return {
        restrict:"E",
        replace:true,
        templateUrl: "common/tpls/contentheader.tpl.html"
    };
}]);
