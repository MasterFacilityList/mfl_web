(function(angular){
    angular.module("mfl.filtering.directives", [])
    .directive("mflPagination", function(){
        return {
            restrict: "EA",
            templateUrl: "advanced_search/tpls/pagination-directive.tpl.html"
        };
    });
})(angular);
