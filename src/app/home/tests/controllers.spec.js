(function (_) {
    "use strict";

    describe("Tests for Home controllers:", function () {
        var controller, scope, root, data, $state, $ctrl, $httpBackend, serverUrl;

        beforeEach(function () {
            module("mfl.home");
            module("mflAppConfig");
            module("templates-app");
            module("templates-common");
            inject(["$rootScope", "$controller","$state","$httpBackend","SERVER_URL",
                function ($rootScope, $controller, _$state, _$httpBackend, SERVER_URL) {
                    root = $rootScope;
                    $httpBackend = _$httpBackend;
                    serverUrl = SERVER_URL;
                    $state = _$state;
                    $ctrl = $controller;
                    scope = root.$new();
                    data = {
                        $scope: scope,
                        $state: $state
                    };
                    controller = function (cntrl) {
                        return $controller(cntrl, data);
                    };
                }]);
        });
        it("should have `mfl.home.controllers.home` defined", function () {
            var ctrl = controller("mfl.home.controllers.home");
            expect(ctrl).toBeDefined();
        });

        it("should search facilites on `mfl.home.controllers.home`", function(){
            spyOn($state, "go");
            controller("mfl.home.controllers.home");
            scope.search("testing");
            expect(scope.loader).toBeTruthy();
        });

        it("should test auto-complete on `mfl.home.controllers.home`", function(){
            spyOn(_, "debounce");
            controller("mfl.home.controllers.home");
            scope.typeaheadFacilities();
            expect(_.debounce).toHaveBeenCalled();
        });
    });
})(window._);
