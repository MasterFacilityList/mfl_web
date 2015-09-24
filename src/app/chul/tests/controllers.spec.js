(function () {
    "use strict";
    describe("Chul controllers: ", function () {
        var rootScope, ctrl, httpBackend, server_url,
        controller, stateParams, state;

        beforeEach(function () {
            module("mflAppConfig");
            module("mfl.chul.services");
            module("mfl.chul.controllers");
            inject(["$controller", "$rootScope", "$httpBackend", "SERVER_URL",
                "$stateParams", "$state",
                function (c, r, h, s, st, sp) {
                    ctrl = function (name, data) {
                        return c("mfl.chul.controllers."+name, data);
                    };
                    controller = c;
                    rootScope = r;
                    httpBackend = h;
                    server_url = s;
                    state = sp;
                    stateParams = st;
                }
            ]);
        });

        it("should load list controller and data", function () {
            var data = {
                "$scope": rootScope.$new()
            };
            ctrl("list", data);
            httpBackend
                .expectGET(server_url+"api/chul/units/")
                .respond(200, {});
            httpBackend.flush();
            httpBackend.verifyNoOutstandingRequest();
            httpBackend.verifyNoOutstandingExpectation();
        });

        it("should test failing to view chul list", function () {
            var data = {
                "$scope": rootScope.$new()
            };
            ctrl("list", data);
            httpBackend
                .expectGET(server_url+"api/chul/units/")
                .respond(500, {});
            httpBackend.flush();
            httpBackend.verifyNoOutstandingRequest();
            httpBackend.verifyNoOutstandingExpectation();
        });

        it("should load view controller and data", function () {
            var data = {
                "$scope": rootScope.$new(),
                "$stateParams": {
                    unit_id: 1
                }
            };
            ctrl("view", data);
            httpBackend
                .expectGET(server_url+"api/chul/units/1/")
                .respond(200, {});
            httpBackend.flush();
            httpBackend.verifyNoOutstandingRequest();
            httpBackend.verifyNoOutstandingExpectation();
        });

        it("should test failing to view one chul", function () {
            var data = {
                "$scope": rootScope.$new(),
                "$stateParams": {
                    unit_id: 1
                }
            };
            ctrl("view", data);
            httpBackend
                .expectGET(server_url+"api/chul/units/1/")
                .respond(500, {});
            httpBackend.flush();
            httpBackend.verifyNoOutstandingRequest();
            httpBackend.verifyNoOutstandingExpectation();
        });

    });
})();