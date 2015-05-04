"use strict";

angular.module("mfl.common.directives")
.directive("contentsubheader", [function () {
    return {
        restrict:"EA",
        require: "ngModel",
        replace:true,
        templateUrl: "common/tpls/contentsubheader.tpl.html"
    };
}]);
