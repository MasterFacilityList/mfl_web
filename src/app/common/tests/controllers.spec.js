"use strict";

describe("Test time controller at bottom of page:", function () {
    var controller, scope, root, data;

    beforeEach(function () {
        module("mflwebApp");
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
        
        expect(scope.time).toBe(Date.now());
    });

});