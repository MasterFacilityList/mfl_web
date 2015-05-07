"use strict";

angular.module("mfl.common.directives")
.directive("contentheader", [ function () {
    return {
        restrict:"E",
        replace:true,
        template: "<div class='content-header'>"+
    "<actionbar action='action'></actionbar>"+
    "<h2 class='content-title'>"+
    "<sil-cont-title title='title'></sil-cont-title></h2>"+
    "<breadcrumbs path='path'></breadcrumbs></div>"
    };
}]);
