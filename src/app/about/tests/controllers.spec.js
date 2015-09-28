(function () {
    "use strict";

    describe("Tests for Downloads controllers:", function () {
        var controller, scope, root, data, $ctrl, httpBackend, serverUrl;

        beforeEach(function () {
            module("mfl.about.controllers");
            module("mfl.facilities.wrapper");
            module("mflAppConfig");

            inject(["$rootScope", "$controller","$httpBackend","SERVER_URL",
                function ($rootScope, $controller, $httpBackend, SERVER_URL) {
                    root = $rootScope;
                    httpBackend = $httpBackend;
                    serverUrl = SERVER_URL;
                    $ctrl = $controller;
                    scope = root.$new();
                    data = {
                        $scope: scope
                    };
                    controller = function (cntrl) {
                        return $controller(cntrl, data);
                    };
                }]);
        });
        it("should mfl.downloads.controllers.downloads defined", function () {
            var ctrl = controller("mfl.about.controllers.about");
            expect(ctrl).toBeDefined();
        });

        it("should make request for current chul services:success", function(){
            controller("mfl.about.controllers.about");
            httpBackend.expectGET(serverUrl+"api/chul/services/")
                .respond(200, {results : []});
            httpBackend.flush();
            httpBackend.verifyNoOutstandingRequest();
            httpBackend.verifyNoOutstandingExpectation();
        });
        it("should make request for current downloads : fail", function(){
            controller("mfl.about.controllers.about");
            httpBackend.expectGET(serverUrl+"api/chul/services/")
                .respond(500, {});
            httpBackend.flush();
            httpBackend.verifyNoOutstandingRequest();
            httpBackend.verifyNoOutstandingExpectation();
        });
    });
})();
