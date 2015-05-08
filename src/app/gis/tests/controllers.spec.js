"use strict";

describe("Tests for GIS controllers:", function () {
    var controller, scope, root, data;

    beforeEach(function () {
        module("mflwebApp");
        module("mfl.gis.controllers");
        module("mfl.gis.wrapper");
        module("mfl.adminunits.wrapper");
        module("mfl.gis.interceptors");

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
        controller("mfl.gis.controllers.gis");
        expect(scope.test).toBe("home");
    });

});