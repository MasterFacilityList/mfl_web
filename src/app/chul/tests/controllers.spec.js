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
            module("mfl.rating.services");
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

        it("should load view controller and data",
        inject(["leafletData", "mfl.rating.services.rating",
           function (leafletData, ratingService) {
            spyOn(ratingService, "getRating").andReturn([3, "A comment"]);
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
            var rating = 3;
            var id = 1;
            data.$scope.cu_rating = {
                cu_id : 1,
                rating : 3,
                comment : "A comment"
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
            data.$scope.getSelectedRating(rating, id);
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

        it("should load view controller and data : no prev ratings",
        inject(["leafletData", "mfl.rating.services.rating",
           function (leafletData, ratingService) {
            spyOn(ratingService, "getRating").andReturn(null);
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
            var rating = 3;
            var id = 1;
            data.$scope.cu_rating = {
                cu_id : 1,
                rating : 3,
                comment : "A comment"
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
            data.$scope.getSelectedRating(rating, id);
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
            var unit = {
                id : 1,
                avg_rating : "4",
                number_of_ratings : "10"
            };
            ctrl("view", data);
            data.$scope.unit = {avg_rating : "", number_of_rating : ""};
            httpBackend
                .expectGET(server_url+"api/chul/units/1/")
                .respond(500, {});
            httpBackend
                .expectGET(server_url+"api/chul/units/1/?fields=avg_rating,number_of_ratings")
                .respond(200, unit);
            data.$scope.getUnitRating();
            httpBackend.flush();
            httpBackend.verifyNoOutstandingRequest();
            httpBackend.verifyNoOutstandingExpectation();
        });

        it("should test fail to get chul rating", function () {
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
            httpBackend
                .expectGET(server_url+"api/chul/units/1/?fields=avg_rating,number_of_ratings")
                .respond(500, {});
            data.$scope.getUnitRating();
            httpBackend.flush();
            httpBackend.verifyNoOutstandingRequest();
            httpBackend.verifyNoOutstandingExpectation();
        });

        it("should test rateCU function" , function () {
            var data = {
                "$scope": rootScope.$new(),
                "$stateParams": {
                    unit_id: 1
                }
            };
            var unit = {
                id : 1,
                avg_rating : "4",
                number_of_ratings : "10",
                ratings : [
                    {
                        current : "3",
                        comment : "This is a comment"
                    }
                ]
            };
            ctrl("view", data);
            data.$scope.unit = {
                avg_rating : "",
                number_of_rating : "",
                spinner : false
            };
            var rslt = {
                chu : "1",
                rating : "3",
                comment : "This is a comment"
            };
            data.$scope.chu_rating = {
                chu : "",
                rating : "",
                comment : ""
            };
            httpBackend
                .expectGET(server_url+"api/chul/units/1/")
                .respond(500, {});
            httpBackend
                .expectPOST(server_url+"api/chul/chu_ratings/")
                .respond(201, rslt);
            httpBackend
                .expectGET(server_url+"api/chul/units/1/?fields=avg_rating,number_of_ratings")
                .respond(200, unit);
            data.$scope.rateCU(unit);
            httpBackend.flush();
            httpBackend.verifyNoOutstandingRequest();
            httpBackend.verifyNoOutstandingExpectation();
        });

        it("should test rateCU function : fail" , function () {
            var data = {
                "$scope": rootScope.$new(),
                "$stateParams": {
                    unit_id: 1
                }
            };
            var unit = {
                id : 1,
                avg_rating : "4",
                number_of_ratings : "10",
                ratings : [
                    {
                        current : "3",
                        comment : "This is a comment"
                    }
                ]
            };
            ctrl("view", data);
            data.$scope.unit = {
                avg_rating : "",
                number_of_rating : "",
                spinner : false
            };
            data.$scope.chu_rating = {
                chu : "",
                rating : "",
                comment : ""
            };
            httpBackend
                .expectGET(server_url+"api/chul/units/1/")
                .respond(500, {});
            httpBackend
                .expectPOST(server_url+"api/chul/chu_ratings/")
                .respond(500, {});
            data.$scope.rateCU(unit);
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
