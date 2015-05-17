(function () {
    "use strict";

    describe("Test time controller at bottom of page:", function () {
        var controller, scope, root, data;

        beforeEach(function () {
            module("mfl.common.controllers");

            inject(["$rootScope", "$controller",
                function ($rootScope, $controller) {
                    root = $rootScope;
                    scope = root.$new();
                    data = {
                        $scope: scope
                    };
                    controller = function (cntrl) {
                        return $controller(cntrl, data);
                    };
                }]);
        });
        it("expect date time to be returned", function () {
            controller("mfl.common.controllers.time");

            // (Date.now() != scope.time) in slow test runs
            // time in scope should be within 100ms of current time
            expect(Date.now() - scope.time).toBeLessThan(100);
        });

    });
})();
