(function () {
    "use strict";

    describe("Directive: Testing the rating directive", function () {
        var rootScope, scope, compile;

        beforeEach(function () {
            module("mflAppConfig");
            module("mfl.rating.directives");

            inject(["$rootScope", "$compile",
                function ($rootScope, $compile) {
                    rootScope = $rootScope;
                    scope = rootScope.$new();
                    scope.ratingValue = 3;
                    scope.max = 5;
                    compile = $compile;
                }
            ]);
        });
        it("should create star rating directive",
        inject(["$rootScope", "$compile",function($rootScope, $compile) {
            var scope = $rootScope.$new();
            var $element = $compile("<div star-rating rating-value='3' " +
                "max='5' getSelectedRating(3, 1)></div>")(scope);
            var isolatedScope = $element.isolateScope();
            isolatedScope.$apply();
            isolatedScope.undo();
            expect(isolatedScope.ratingValue).toBeDefined();
            expect(isolatedScope.ratingValue).toEqual(3);
        }]));
        it("should hover method",
        inject(["$rootScope", "$compile",function($rootScope, $compile) {
            var scope = $rootScope.$new();
            var $element = $compile("<div star-rating rating-value='3' " +
                "max='5' getSelectedRating(3, 1)></div>")(scope);
            var isolatedScope = $element.isolateScope();
            isolatedScope.$apply();
            var three = 3;
            isolatedScope.hover(three);
            expect(isolatedScope.ratingValue).toEqual(4);
        }]));
        it("should hover method",
        inject(["$rootScope", "$compile",function($rootScope, $compile) {
            var scope = $rootScope.$new();
            scope.ratingValue = 3;
            scope.max = 5;
            var $element = $compile("<div star-rating rating-value='3' " +
                "max='5' getSelectedRating(3, 1)></div>")(scope);
            var isolatedScope = $element.isolateScope();
            isolatedScope.$apply();
            var three = 3;
            isolatedScope.toggle(three);
            expect(isolatedScope.ratingValue).toEqual(scope.ratingValue + 1);
        }]));
    });
})();
