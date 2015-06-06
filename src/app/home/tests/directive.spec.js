(function () {
    "use strict";

    describe("Directive: Testing sync focus directive", function () {
        var rootScope, scope, compile;

        beforeEach(function () {
            module("mflAppConfig");
            module("mfl.home.directives");

            inject(["$rootScope", "$compile",
                function ($rootScope, $compile) {
                    rootScope = $rootScope;
                    scope = rootScope.$new();
                    scope.syncFocusWith = false;
                    compile = $compile;
                }
            ]);
        });
        it("should create syncFocusWith directive",
        inject(["$rootScope", "$compile", function ($rootScope, $compile) {
            var scope = $rootScope.$new();
            var $element = $compile(
                "<input sync-focus-with='syncFocusWith'/>")(scope);
            var isolateScope = $element.isolateScope();
            isolateScope.$apply();
            isolateScope.focusValue = false;
            scope.$digest();

            isolateScope.focusValue = true;
            scope.$digest();
            expect(isolateScope.focusValue).toEqual(true);
        }]));
        it("should create syncFocusWith directive",
        inject(["$rootScope", "$compile", function ($rootScope, $compile) {
            var scope = $rootScope.$new();
            var $element = $compile(
                "<input sync-focus-with='syncFocusWith'/>")(scope);
            var isolateScope = $element.isolateScope();
            isolateScope.$apply();
            isolateScope.focusValue = true;
            scope.$digest();

            isolateScope.focusValue = false;
            scope.$digest();
            expect(isolateScope.focusValue).toEqual(false);
        }]));
    });
})();
