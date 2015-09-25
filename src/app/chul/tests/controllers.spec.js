(function () {
    "use strict";
    describe("Chul controllers: ", function () {
        var rootScope, ctrl, httpBackend, server_url,
        controller, stateParams, state;

        beforeEach(function () {
            module("mflAppConfig");
            module("mfl.chul.services");
            module("mfl.facility_filter.services");
            module("mfl.gis.wrapper");
            module("leaflet-directive");
            module("mfl.chul.controllers");
            inject(["$controller", "$rootScope", "$httpBackend", "SERVER_URL",
                "$stateParams", "$state","leafletData",
                function (c, r, h, s, st, sp,leafletData) {
                    ctrl = function (name, data) {
                        return c("mfl.chul.controllers."+name, data);
                    };
                    controller = c;
                    leafletData = leafletData;
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
            data.$scope.unit = {
                facility: 1
            };
            ctrl("view", data);
            httpBackend
                .expectGET(server_url+"api/chul/units/1/")
                .respond(200, {facility:1});
            httpBackend
                .expectGET(server_url+"api/facilities/facilities/1/")
                .respond(200, {
                    properties:{
                        bound:{
                                coordinates:[0,1]
                            }
                        },
                        boundaries:{
                            ward_boundary:1
                        }
                    }
                    );
            httpBackend
                .expectGET(server_url+"api/gis/ward_boundaries/1/")
                .respond(200, {boundaries:{ward_boundary:1}});
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