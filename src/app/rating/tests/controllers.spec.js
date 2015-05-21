(function () {
    "use strict";

    describe("Tests for ratings controller: ", function () {
        var controller, scope, root, data, httpBackend, SERVER_URL, windows;

        beforeEach(function () {
            module("mflAppConfig");
            module("mfl.rating");
            module("mfl.facilities.wrapper");
            module("mfl.rating.services");

            inject(["$rootScope", "$controller", "$httpBackend", "SERVER_URL",
                "facilitiesApi", "$window", "mfl.rating.services.rating",
                function ($rootScope, $controller, $httpBackend, url,
                    facilitiesApi, $window, ratingService) {
                    root = $rootScope;
                    scope = root.$new();
                    httpBackend = $httpBackend;
                    SERVER_URL = url;
                    windows = $window;
                    facilitiesApi = facilitiesApi;
                    ratingService = ratingService;
                    scope.fakeStateParams = {
                        fac_id : 1
                    };
                    data = {
                        $scope :scope,
                        facilitiesApi : facilitiesApi,
                        ratingService : ratingService,
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
            var test = "Rating";
            expect(test).toEqual(scope.test);
        });
        it("should test if ratings are added to facilities services",
        inject(["$httpBackend", "mfl.rating.services.rating",
            function ($httpBackend, ratingService) {
                spyOn(ratingService, "getRating").andReturn(3);
                controller("mfl.rating.controllers.rating");
                var rating = 3;
                var id = 1;
                scope.fac_rating = {
                    facility_service : id,
                    rating : rating
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
                    ]
                };
                $httpBackend.expectGET(SERVER_URL +
                    "api/facilities/facilities/1/").respond(200, data);
                var rate = [
                    {
                        current : 3,
                        max: 5
                    }
                ];
                $httpBackend.flush();
                expect(
                    scope.oneFacility.facility_services[0].ratings).toEqual(rate);
                scope.getSelectedRating(rating, id);
                $httpBackend.expectPOST(
                    SERVER_URL +
                    "api/facilities/facility_service_ratings/").
                    respond(200, scope.fac_rating);
                //get one facility and redisplay all of its details
                $httpBackend.expectGET(SERVER_URL +
                    "api/facilities/facilities/1/").respond(200, data);
                $httpBackend.flush();

            }
        ]));
        it("should test if no ratings in localstorage ",
            inject(["$httpBackend", "mfl.rating.services.rating",
            function ($httpBackend, ratingService) {
                spyOn(ratingService, "getRating").andReturn(null);
                controller("mfl.rating.controllers.rating");
                /*var rating = 3;
                var id = 1;
                scope.fac_rating = {
                    facility_service : id,
                    rating : rating
                };*/
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
                    ]
                };
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
            $httpBackend.expectGET(
                SERVER_URL +
                "api/facilities/facilities/1/").respond(400, {name : ""});
            var rating = 3;
            var id = 1;
            scope.getSelectedRating(rating, id);
            $httpBackend.expectPOST(
                    SERVER_URL +
                    "api/facilities/facility_service_ratings/").
                    respond(400, {name : ""});
            $httpBackend.flush();
        }]));
        it("should print facilities' detailed view",
        inject(["$window", function ($window) {
            spyOn($window, "print");
            controller("mfl.rating.controllers.rating");
            scope.printing();
            expect($window.print).toHaveBeenCalled();
        }]));
    });
})();
