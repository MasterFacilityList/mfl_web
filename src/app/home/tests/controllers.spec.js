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

        it("should launch facility search", function(){
            var scope = rootScope.$new();
            spyOn(state, "go");
            controller("mfl.home.controllers.home", {
                "$scope": scope,
                "$state": state
            });
            scope.search("testing");
            expect(scope.loader).toBeTruthy();
            expect(state.go.calls[0].args[0]).toEqual("facility_filter.results");
            expect(state.go.calls[0].args[1]).toEqual({"search": "testing"});
        });

        it("should launch CHU search", function(){
            var scope = rootScope.$new();
            spyOn(state, "go");
            controller("mfl.home.controllers.home", {
                "$scope": scope,
                "$state": state
            });
            scope.chu_mode = true;
            scope.service_mode = "Community Health Units";
            scope.search("testing");
            expect(scope.loader).toBeTruthy();
            expect(state.go.calls[0].args[0]).toEqual("chul_filter.results");
            expect(state.go.calls[0].args[1]).toEqual({"search": "testing"});
        });

        it("should launch Services search", function(){
            var scope = rootScope.$new();
            spyOn(state, "go");
            controller("mfl.home.controllers.home", {
                "$scope": scope,
                "$state": state
            });
            scope.chu_mode = false;
            scope.service_mode = "Services";
            scope.search("testing");
            expect(scope.loader).toBeTruthy();
            expect(state.go.calls[0].args[0]).toEqual("facility_filter.results");
            expect(state.go.calls[0].args[1]).toEqual({"service_name": "testing"});
        });

        it("should test facility typeahead", function(){
            var scope = rootScope.$new();
            spyOn(_, "debounce");
            scope.service_mode = "Facilities";
            controller("mfl.home.controllers.home", {
                "$scope": scope
            });
            scope.typeaheadFacilities();
            expect(_.debounce).toHaveBeenCalled();
        });

        it("should test chu typeahead", function(){
            var scope = rootScope.$new();
            spyOn(_, "debounce");
            controller("mfl.home.controllers.home", {
                "$scope": scope
            });
            scope.typeaheadCHUs();
            expect(_.debounce).toHaveBeenCalled();
        });
        it("should set service_mode  to Services", function(){
            var scope = rootScope.$new();
            controller("mfl.home.controllers.home", {
                "$scope": scope
            });
            scope.service_mode = "fahdf";
            scope.typeaheadCHUs();
            expect(scope.set_search_mode()).toEqual("Services");
        });
    });

})(window._);
