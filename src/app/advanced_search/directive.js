(function(angular){
    angular.module("mfl.filtering.directives", [])
    .directive("mflPagination", function(){
        return {
            restrict: "EA",
            templateUrl: "advanced_search/tpls/pagination-directive.tpl.html"
        };
    })
    .directive("advancedSearch", function(){
        return {
            restrict: "EA",
            templateUrl: "advanced_search/tpls/advanced_search_form.tpl.html"
        };
    })
    .directive("mflKeyPress", function () {
        return function (scope, element) {
            element.bind("keydown keypress", function (event) {
                //enter key press
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.filterFacility(scope.filter);
                    });
                    event.preventDefault();
                }
                //esc key press
                if(event.which === 27) {
                    scope.$apply(function (){
                        scope.clearFilters();
                    });
                    event.preventDefault();
                }

            });
        };
    });
})(angular);
