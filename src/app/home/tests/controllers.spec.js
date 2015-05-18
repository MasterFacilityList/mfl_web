(function () {
    "use strict";

    describe("Tests for Home controllers:", function () {
        var controller, scope, root, data;

        beforeEach(function () {
            module("mfl.home.controllers");

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
        it("should expect $scope.test to equal 'home'", function () {
            controller("mfl.home.controllers.home");
            expect(scope.test).toBe("home");
        });

    });
})();
