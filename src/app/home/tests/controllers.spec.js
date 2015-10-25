(function (_) {
    "use strict";

    describe("Test Home controller", function () {
        var controller, rootScope, state, httpBackend, serverUrl;

        beforeEach(function () {
            module("mfl.home.controllers");
            module("mflAppConfig");

            inject(["$rootScope", "$controller","$state","$httpBackend","SERVER_URL",
                function ($rootScope, $controller, $state, $httpBackend, SERVER_URL) {
                    rootScope = $rootScope;
                    httpBackend = $httpBackend;
                    serverUrl = SERVER_URL;
                    state = $state;
                    controller = $controller;
                }]);
        });

        it("should handle failure to load chu service list", function () {
            var scope = rootScope.$new();
            httpBackend
                .expectGET(serverUrl+"api/chul/services/?fields=name,description")
                .respond(500, {});
            controller("mfl.home.controllers.home", {
                "$scope": scope
            });
            httpBackend.flush();
            httpBackend.verifyNoOutstandingRequest();
            httpBackend.verifyNoOutstandingExpectation();
            expect(scope.errors).toEqual({});
            expect(scope.services).toBe(undefined);
            expect(scope.spinner).toBe(false);
        });

        it("should load chu service list", function () {
            var scope = rootScope.$new();
            httpBackend
                .expectGET(serverUrl+"api/chul/services/?fields=name,description")
                .respond(200, {"results": []});
            controller("mfl.home.controllers.home", {"$scope": scope});
            httpBackend.flush();
            httpBackend.verifyNoOutstandingRequest();
            httpBackend.verifyNoOutstandingExpectation();
            expect(scope.errors).toBe(undefined);
            expect(scope.services).toEqual([]);
            expect(scope.spinner).toBe(false);
        });

        it("should search facilites on `mfl.home.controllers.home`", function(){
            var scope = rootScope.$new();
            spyOn(state, "go");
            controller("mfl.home.controllers.home", {
                "$scope": scope,
                "$state": state
            });
            scope.search("testing");
            expect(scope.loader).toBeTruthy();
        });

        it("should test auto-complete on `mfl.home.controllers.home`", function(){
            var scope = rootScope.$new();
            spyOn(_, "debounce");
            controller("mfl.home.controllers.home", {
                "$scope": scope
            });
            scope.typeaheadFacilities();
            expect(_.debounce).toHaveBeenCalled();
        });
    });

})(window._);
