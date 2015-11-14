(function (angular) {
    "use strict";

    describe("Tests for ratings controller: ", function () {
        var controller, scope, root, data, httpBackend, SERVER_URL, windows;

        beforeEach(function () {
            module("mflAppConfig");
            module("mfl.rating");
            module("mfl.facilities.wrapper");
            module("mfl.rating.services");
            module("mfl.gis.wrapper");

            inject(["$rootScope", "$controller", "$httpBackend", "SERVER_URL",
                "facilitiesApi", "$window", "mfl.rating.services.rating","gisAdminUnitsApi",
                function ($rootScope, $controller, $httpBackend, url,
                    facilitiesApi, $window, ratingService,gisAdminUnitsApi) {
                    root = $rootScope;
                    scope = root.$new();
                    httpBackend = $httpBackend;
                    SERVER_URL = url;
                    windows = $window;
                    facilitiesApi = facilitiesApi;
                    ratingService = ratingService;
                    gisAdminUnitsApi = gisAdminUnitsApi;
                    scope.fakeStateParams = {
                        fac_id : 1
                    };
                    data = {
                        $scope :scope,
                        facilitiesApi : facilitiesApi,
                        ratingService : ratingService,
                        gisAdminUnitsApi : gisAdminUnitsApi,
                        SERVER_URL : url,
                        $stateParams : scope.fakeStateParams
                    };
                    controller = function (cntrl) {
                        return $controller(cntrl, data);
                    };
                }
            ]);
        });
        it("should test rating controller scope variable", function () {
            controller("mfl.rating.controllers.rating");
            var test = true;
            expect(test).toEqual(scope.spinneractive);
        });
        it("should test if ratings are added to facilities services",
        inject(["$httpBackend", "mfl.rating.services.rating",
            function ($httpBackend, ratingService) {
                spyOn(ratingService, "getRating").andReturn([3, "A comment"]);
                controller("mfl.rating.controllers.rating");
                var rating = 3;
                var id = 1;
                var comment = "A comment";
                var service_obj = {
                    id: 1,
                    ratings : [3, "A comment"]
                };
                scope.fac_rating = {
                    facility_service : id,
                    rating : rating,
                    comment : comment
                };
                var data = {
                    facility_services: [
                        {
                            name: "owaga"
                        },
                        {
                            name: "knh"
                        },
                        {
                            name: "hostel"
                        }
                    ],
                    county_code:1,
                    constituency_code:1,
                    ward_code:1
                };

                $httpBackend
                .expectGET(SERVER_URL +
                "api/chul/units/?facility=1&fields=id,code,name,status_name,households_monitored")
                .respond(200, {name : "chu"});

                $httpBackend.expectGET(SERVER_URL +
                    "api/facilities/facilities/1/").respond(200, data);

                var rate = [
                    {
                        current : 3,
                        max: 5
                    }
                ];
                $httpBackend.flush();
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
                $httpBackend.resetExpectations();

                expect(
                    scope.oneFacility.facility_services[0].ratings).toEqual(rate);
                scope.rateService(service_obj);
                scope.getSelectedRating(rating, id, service_obj);
                $httpBackend.expectPOST(
                    SERVER_URL +
                    "api/facilities/facility_service_ratings/").
                    respond(200, scope.fac_rating);
                //get one facility and redisplay all of its details
                $httpBackend
                .expectGET(SERVER_URL +
                "api/chul/units/?facility=1&fields=id,code,name,status_name,households_monitored")
                .respond(200, {name : "chu"});
                $httpBackend.expectGET(SERVER_URL +
                    "api/facilities/facilities/1/").respond(200, data);

                $httpBackend.flush();
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();

                expect(service_obj.spinner).toBeFalsy();
            }
        ]));

        it("should test if no ratings in localstorage ",
            inject(["$httpBackend", "mfl.rating.services.rating",
            function ($httpBackend, ratingService) {
                spyOn(ratingService, "getRating").andReturn(null);
                controller("mfl.rating.controllers.rating");
                var data = {
                    facility_services: [
                        {
                            name: "owaga"
                        },
                        {
                            name: "knh"
                        },
                        {
                            name: "hostel"
                        }
                    ],
                    county_code:1,
                    constituency_code:1,
                    ward_code:1
                };

                $httpBackend
                .expectGET(SERVER_URL +
                "api/chul/units/?facility=1&fields=id,code,name,status_name,households_monitored")
                .respond(200, {name : "chu"});
                $httpBackend.expectGET(SERVER_URL +
                    "api/facilities/facilities/1/").respond(200, data);

                var rate = [
                    {
                        current : 0,
                        max: 5
                    }
                ];
                $httpBackend.flush();
                expect(
                    scope.oneFacility.facility_services[0].ratings).toEqual(rate);
            }])
        );

        it("should fail on call to rate a facility service",
        inject(["$httpBackend", function ($httpBackend) {
            controller("mfl.rating.controllers.rating");
            $httpBackend
                .expectGET(SERVER_URL +
                "api/chul/units/?facility=1&fields=id,code,name,status_name,households_monitored")
                .respond(400, {});
            $httpBackend.expectGET(
                SERVER_URL +
                "api/facilities/facilities/1/").respond(400, {name : ""});
            var rating = 3;
            var id = 1;
            var service_obj = {
                id: 1,
                ratings : [3, "A comment"]
            };
            scope.rateService(service_obj);
            scope.getSelectedRating(rating, id);
            $httpBackend.expectPOST(
                    SERVER_URL +
                    "api/facilities/facility_service_ratings/").
                    respond(400, {name : ""});
            $httpBackend.flush();
            expect(service_obj.spinner).toBeFalsy();
        }]));

        it("should fail to load gis requests",
        inject(["$httpBackend",function ($httpBackend) {
                var data = {
                    facility_services: [
                        {
                            name: "owaga"
                        },
                        {
                            name: "knh"
                        },
                        {
                            name: "hostel"
                        }
                    ],
                    county_code:1,
                    constituency_code:1,
                    ward_code:1
                };

                controller("mfl.rating.controllers.rating");

                $httpBackend
                .expectGET(SERVER_URL +
                "api/chul/units/?facility=1&fields=id,code,name,status_name,households_monitored")
                .respond(200, {name : "chu"});

                $httpBackend.expectGET(SERVER_URL +
                    "api/facilities/facilities/1/").respond(200, data);

                $httpBackend.flush();
            }]));

        it("should print facilities' detailed view",
        inject(["$window", function ($window) {
            spyOn($window, "print");
            controller("mfl.rating.controllers.rating");
            scope.printing();
        }]));
    });
    describe("Test for gis controller in ratings app:", function () {
        var controller, scope, root, data, httpBackend, SERVER_URL;

        beforeEach(function () {
            module("mflAppConfig");
            module("mfl.rating");
            module("mfl.facilities.wrapper");
            module("mfl.rating.services");
            module("mfl.gis.wrapper");
            module("leaflet-directive");

            inject(["$rootScope", "$controller", "$httpBackend", "SERVER_URL",
                "facilitiesApi", "mfl.rating.services.rating","gisAdminUnitsApi",
                    "leafletData",
                function ($rootScope, $controller, $httpBackend, url,
                    facilitiesApi,ratingService,gisAdminUnitsApi,leafletData) {
                    root = $rootScope;
                    scope = root.$new();
                    httpBackend = $httpBackend;
                    SERVER_URL = url;
                    scope.fakeStateParams = {
                        fac_id : 1
                    };
                    data = {
                        $scope :scope,
                        gisAdminUnitsApi : gisAdminUnitsApi,
                        SERVER_URL : url,
                        leafletData: leafletData,
                        $stateParams : scope.fakeStateParams
                    };
                    controller = function (cntrl) {
                        return $controller(cntrl, data);
                    };
                }
            ]);
        });
        it("should load data required by controller",
        inject(["$httpBackend","leafletData",
            function ($httpBackend,leafletData) {
                var data = {
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
                $httpBackend.expectGET(SERVER_URL +
                    "api/gis/drilldown/ward/1/").respond(200, data);

                spyOn(scope, "$on").andCallThrough();
                spyOn(leafletData, "getMap").andReturn(obj);
                spyOn(obj, "then");

                controller("mfl.rating.controllers.rating.map");
                scope.oneFacility = {
                    ward : 1,
                    lat_long: [1,1],
                    ward_code:1
                };
                scope.$apply();
                scope.$digest();

                $httpBackend.flush();
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
        it("should fail to load data for acquiring one facility",
            function () {
                controller("mfl.rating.controllers.rating.map");
                scope.oneFacility = undefined;
                scope.$apply();
                scope.$digest();
            });
        it("should fail to load data required by for wards in the controller",
        inject(["$httpBackend",
            function ($httpBackend) {
                $httpBackend.expectGET(SERVER_URL +
                    "api/gis/drilldown/ward/1/").respond(500, {});
                controller("mfl.rating.controllers.rating.map");
                scope.oneFacility = {
                    ward : 1,
                    lat_long: [1,1],
                    ward_code:1
                };
                scope.$apply();
                scope.$digest();
                $httpBackend.flush();
            }]));
        it("should fail to load data required by for facilities in the controller",
        inject(["$httpBackend",
            function ($httpBackend) {
                var data = {
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
                                [1,2],[3,4]
                            ]
                        }
                    }
                };
                $httpBackend.expectGET(SERVER_URL +
                    "api/gis/drilldown/ward/1/").respond(200, data);

                controller("mfl.rating.controllers.rating.map");
                scope.oneFacility = {
                    ward : 1,
                    lat_long: [1,1],
                    ward_code:1
                };
                scope.$apply();
                scope.$digest();
                $httpBackend.flush();
            }]));
    });
})(window.angular);
