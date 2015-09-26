(function (angular) {
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

        it("should load view controller and data",
        inject(["leafletData",
           function (leafletData) {
            var data = {
                "$scope": rootScope.$new(),
                "$stateParams": {
                    unit_id: 1
                }
            };
            var unit = {
                boundaries:{
                    ward_boundary: 1
                },
                geo_features:{
                    geometry:{
                        coordinates:[0,1]
                    }
                }
            };
            var boundary = {
                    geometry:{
                        coordinates: {
                            coordinates:[
                                [1,2],[3,4]
                            ]
                        }
                    },
                    properties: {
                        coordinates: {
                            coordinates:[
                                [1,2],[3,4]
                            ]
                        },
                        bound: {
                            coordinates:[
                                [
                                    [1,2],[3,4]
                                ]
                            ]
                        }
                    }
                };
            var obj = {
                then: angular.noop
            };
            data.$scope.unit = {
                facility: 1
            };
            httpBackend
                .expectGET(server_url+"api/chul/units/1/")
                .respond(200, unit);
            httpBackend
                .expectGET(server_url+"api/gis/ward_boundaries/1/")
                .respond(200, boundary);
            ctrl("view", data);
            spyOn(data.$scope, "$on").andCallThrough();
            spyOn(leafletData, "getMap").andReturn(obj);
            spyOn(obj, "then");

            data.$scope.$apply();
            data.$scope.$digest();

            httpBackend.flush();
            httpBackend.verifyNoOutstandingRequest();
            httpBackend.verifyNoOutstandingExpectation();

            expect(leafletData.getMap).toHaveBeenCalled();
            expect(obj.then).toHaveBeenCalled();

            var then_fxn = obj.then.calls[0].args[0];
            expect(angular.isFunction(then_fxn)).toBe(true);
            var map = {
                fitBounds: angular.noop
            };
            spyOn(map, "fitBounds");
            then_fxn(map);
            expect(map.fitBounds).toHaveBeenCalledWith([[2,1],
                                                        [4,3]]);
        }]));

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

        it("should test fail to load ward boundary details", function () {
            var data = {
                "$scope": rootScope.$new(),
                "$stateParams": {
                    unit_id: 1
                }
            };
            var unit = {
                boundaries:{
                    ward_boundary: 1
                },
                geo_features:{
                    geometry:{
                        coordinates:[0,1]
                    }
                }
            };
            ctrl("view", data);
            httpBackend
                .expectGET(server_url+"api/chul/units/1/")
                .respond(200, unit);
            httpBackend
                .expectGET(server_url+"api/gis/ward_boundaries/1/")
                .respond(500,{});
            httpBackend.flush();
            httpBackend.verifyNoOutstandingRequest();
            httpBackend.verifyNoOutstandingExpectation();
        });

    });
})(window.angular);
