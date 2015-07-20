(function (angular) {

    "use strict";

    angular.module("mfl.rating.directives", [])

    .directive("starRating", function () {
        return {
            restrict: "A",
            scope : {
                ratingValue: "=",
                max: "=",
                onRatingSelected: "&"
            },
            template: "<ul class='rating'>" +
                        "<li ng-repeat='star in stars' ng-class='star' " +
                        "ng-click='toggle($index)' " +
                        "ng-mouseover='hover($index)' " +
                        "ng-mouseout='undo($index)'> " +
                        "\u2605 </li>" +
                        "</ul>",
            link: function (scope) {
                var oldValue = scope.ratingValue;

                var updateStars = function () {
                    scope.stars = [];
                    for (var i = 0; i < scope.max; i++) {
                        scope.stars.push({
                            filled: i < scope.ratingValue
                        });
                    }
                };

                scope.undo = function () {
                    scope.ratingValue = oldValue;
                };

                scope.hover = function (index) {
                    scope.ratingValue = index + 1;
                };

                scope.toggle = function (index) {
                    scope.hover(index);
                    oldValue = index + 1;
                    scope.onRatingSelected({
                        rating: index + 1
                    });
                };

                scope.$watch("ratingValue", function () {
                    updateStars();
                });
            }
        };
    })

    .directive("contentSlideIn", [function () {
        function link( $scope, element, attributes ) {
            var expression = attributes.contentSlideIn;
            var duration = ( attributes.slideShowDuration || "fast" );
            if ( ! $scope.$eval(expression)) {
                element.hide();
            }
            $scope.$watch(
                expression,
                function( newValue, oldValue ) {
                    if ( newValue === oldValue ) {
                        return;
                    }
                    if ( newValue ) {
                        element
                            .stop( true, true )
                            .slideDown( duration )
                        ;
                    } else {
                        element
                            .stop( true, true )
                            .slideUp( duration )
                        ;
                    }
                }
            );
        }
        return({
            link: link,
            restrict: "A"
        });
    }]);
})(window.angular);
