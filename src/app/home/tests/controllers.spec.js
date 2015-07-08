(function () {
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
        it("it should have `mfl.home.controllers.home` defined", function () {
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

        it("it should have `mfl.home.controllers.header` defined", function () {
            var ctrl = controller("mfl.home.controllers.header");
            expect(ctrl).toBeDefined();
        });

        it("shuld have `mfl.home.controllers.facility_details`defined list facilities",function (){
            $httpBackend.expectGET(serverUrl+"api/facilities/facilities/10/")
            .respond(200, {results: "ok"});
            var cont = $ctrl(
                "mfl.home.controllers.facility_details",
                {
                    $scope: scope,
                    $state: {
                        params: {
                            fac_id: 10
                        }
                    }
                }
            );

            expect(cont).toBeDefined();
            $httpBackend.flush();
            expect(scope.oneFacility).toEqual({results: "ok"});
        });


        it("`mfl.home.controllers.facility_details`, list facilities: error",function (){
            $httpBackend.expectGET(serverUrl+"api/facilities/facilities/10/")
            .respond(500, {error: "error"});
            $ctrl(
                "mfl.home.controllers.facility_details",
                {
                    $scope: scope,
                    $state: {
                        params: {
                            fac_id: 10
                        }
                    }
                }
            );
            $httpBackend.flush();
            expect(scope.alert).toEqual("error");
        });


    });
})();
