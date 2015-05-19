(function () {
    "use strict";

    describe("Tests for ratings controller: ", function () {
        var controller, scope, root, data, httpBackend, SERVER_URL;

        beforeEach(function () {
            module("mflAppConfig");
            module("mfl.rating");
            module("mfl.facilities.wrapper");

            inject(["$rootScope", "$controller", "$httpBackend", "SERVER_URL",
                "facilitiesApi",
                function ($rootScope, $controller, $httpBackend, url,
                    facilitiesApi) {
                    root = $rootScope;
                    scope = root.$new();
                    httpBackend = $httpBackend;
                    SERVER_URL = url;
                    facilitiesApi = facilitiesApi;
                    data = {
                        $scope :scope,
                        facilitiesApi : facilitiesApi,
                        SERVER_URL : url
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
        inject(["$httpBackend", function ($httpBackend) {
                controller("mfl.rating.controllers.rating");
                var data = "";
                var rating = 3;
                var id = "4d014de5-b500-439e-98b5-2fa1b5836b15";
                scope.fac_rating = {
                    facility_service : id,
                    rating : rating
                };
                var arg = {
                    test : [
                        {
                            id : "",
                            service_name: "",
                            ratings: [
                                {current: 0, max: 5}
                            ]
                        }
                    ]
                };
                var equal = arg.test[0];
                scope.oneFacility = {
                    facility_services : [
                        {
                            id : "",
                            service_name: ""
                        }
                    ]
                };
                _.each(scope.oneFacility.facility_services, function (serv) {
                    serv.ratings = [
                        {
                            current: 0,
                            max: 5
                        }
                    ];
                });
                $httpBackend.expectGET(SERVER_URL +
                    "api/facilities/facilities/1e0d5bc8-aa79-4c38-" +
                    "b938-714c28837c61/").respond(200, data);
                expect(
                    scope.oneFacility.facility_services).toContain(
                        equal);
                scope.getSelectedRating(rating, id);
                $httpBackend.expectPOST(
                    SERVER_URL +
                    "api/facilities/facility_service_ratings/").
                    respond(200, scope.fac_rating);
                $httpBackend.flush();
            }
        ]));
        it("should fail on call to rate a facility service",
        inject(["$httpBackend", function ($httpBackend) {
            controller("mfl.rating.controllers.rating");
            $httpBackend.expectGET(
                SERVER_URL +
                "api/facilities/facilities/1e0d5bc8-aa79-4c38-" +
                "b938-714c28837c61/").respond(400, {name : ""});
            var rating = 3;
            var id = "4d014de5-b500-439e-98b5-2fa1b5836b15";
            scope.getSelectedRating(rating, id);
            $httpBackend.expectPOST(
                    SERVER_URL +
                    "api/facilities/facility_service_ratings/").
                    respond(400, {name : ""});
            $httpBackend.flush();
        }]));
    });
})();
