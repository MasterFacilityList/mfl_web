(function (angular) {
    "use strict";

    angular.module("mfl.common.directives", [])

    .directive("actionbar", ["$compile", function ($compile) {  //Generates breadcrumbs
        return {
            restrict: "E",
            replace: true,
            scope:{
                action:"="
            },
            template: "<div class='action-container content-header-extra'></div>",
            link: function ($scope, $element) {
                var action = "";
                _.each($scope.action, function (link) {
                    action = action + "<a " + link.func+ " class=' " + link.class +" '" +
                        link.color +
                        "' tooltip-placement='bottom' tooltip='"+link.tipmsg+"'><i class=' fa "+
                        link.icon+"'></i></a>";
                });
                $element.html(action);
                $compile($element)($scope);
            }
        };
    }])

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
    }])

    .directive("contentheader", [ function () {
        return {
            restrict:"E",
            replace:true,
            template: "<div class='content-header'>"+
        "<actionbar action='action'></actionbar>"+
        "<h2 class='content-title'>"+
        "<content-title title='title'></content-title></h2>"+
        "<breadcrumbs path='path'></breadcrumbs></div>"
        };
    }])

    .directive("contentTitle", ["$compile", function ($compile) {  //Generates title
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


})(angular);
