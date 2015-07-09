(function () {

    "use strict";

    describe("Test facility filter controllers", function () {
        var ctrl, rootScope, state, server_url, httpBackend;

        beforeEach(function () {
            module("mfl.facility_filter.controllers");
            module("mfl.facility_filter.states");

            module("mflAppConfig");
            module("ui.select");
            module("ui.router");

            inject(["$controller", "$rootScope", "$state", "$httpBackend", "SERVER_URL",
                function ($controller, $rootScope, $state, $httpBackend, SU) {
                    httpBackend = $httpBackend;
                    server_url = SU;
                    rootScope = $rootScope;
                    state = $state;
                    ctrl = function (name, data) {
                        return $controller("mfl.facility_filter.controllers."+name, data);
                    };
                }]
            );
        });

        describe("test form controller", function () {

            it("should load filter summaries", function () {
                var data = {
                    "$scope": rootScope.$new()
                };

                httpBackend
                    .expectGET(server_url+"api/common/filtering_summaries/" +
                               "?fields=county,facility_type,constituency," +
                               "ward,operation_status,service_category,owner_type,owner")
                    .respond(200, {});

                ctrl("form", data);

                httpBackend.flush();
                httpBackend.verifyNoOutstandingRequest();
                httpBackend.verifyNoOutstandingExpectation();

                expect(data.$scope.filter_summaries).toEqual({});
            });

            it("should filter facilities", function () {
                var data = {
                    "$scope": rootScope.$new(),
                    "$state": state
                };

                httpBackend
                    .expectGET(server_url+"api/common/filtering_summaries/" +
                               "?fields=county,facility_type,constituency," +
                               "ward,operation_status,service_category,owner_type,owner")
                    .respond(200, {});

                spyOn(state, "go");
                ctrl("form", data);

                httpBackend.flush();
                httpBackend.verifyNoOutstandingRequest();
                httpBackend.verifyNoOutstandingExpectation();

                data.$scope.filters.multiple.county = [
                    {"id": "3"}
                ];
                data.$scope.filterFacilities();
                expect(state.go).toHaveBeenCalledWith("facility_filter.results", {
                    "county": "3",
                    "facility_type" : "",
                    "constituency" : "",
                    "ward" : "",
                    "operation_status" : "",
                    "service_category" : "",
                    "owner_type" : "",
                    "owner" : "",
                    "service": ""
                });
            });

            it("should clear filter facilities", function () {
                var data = {
                    "$scope": rootScope.$new(),
                    "$state": state
                };

                httpBackend
                    .expectGET(server_url+"api/common/filtering_summaries/" +
                               "?fields=county,facility_type,constituency," +
                               "ward,operation_status,service_category,owner_type,owner")
                    .respond(200, {});

                spyOn(state, "go");
                ctrl("form", data);

                httpBackend.flush();
                httpBackend.verifyNoOutstandingRequest();
                httpBackend.verifyNoOutstandingExpectation();

                data.$scope.filters.multiple.county = [
                    {"id": "3"}
                ];
                data.$scope.clearFilters();
                expect(state.go).toHaveBeenCalledWith("facility_filter", {});
            });

            it("should filter lists", function () {
                var data = {
                    "$scope": rootScope.$new(),
                    "$state": state
                };

                httpBackend
                    .expectGET(server_url+"api/common/filtering_summaries/" +
                               "?fields=county,facility_type,constituency," +
                               "ward,operation_status,service_category,owner_type,owner")
                    .respond(200, {});

                spyOn(state, "go");
                ctrl("form", data);

                httpBackend.flush();
                httpBackend.verifyNoOutstandingRequest();
                httpBackend.verifyNoOutstandingExpectation();

                data.$scope.filters.multiple.county = [
                    {"id": "1"}, {"id": "2"}
                ];
                data.$scope.filters.multiple.constituency = [
                    {"id": "1", "county": "1"}, {"id": "2", "county": "1"},
                    {"id": "3", "county": "2"}, {"id": "4", "county": "3"}
                ];

                data.$scope.filters.multiple.ward = [
                    {"id": "1", "constituency": "1"}, {"id": "2", "constituency": "1"},
                    {"id": "3", "constituency": "2"}, {"id": "4", "constituency": "3"}
                ];

                expect(
                    data.$scope.filterFxns.constFilter({"id": "1", "county": "1"})
                ).toBe(true);
                expect(
                    data.$scope.filterFxns.constFilter({"id": "3", "county": "2"})
                ).toBe(true);
                expect(
                    data.$scope.filterFxns.constFilter({"id": "4", "county": "3"})
                ).toBe(false);

                expect(
                    data.$scope.filterFxns.wardFilter({"id": "1", "constituency": "1"})
                ).toBe(true);
                expect(
                    data.$scope.filterFxns.wardFilter({"id": "3", "constituency": "2"})
                ).toBe(true);
                expect(
                    data.$scope.filterFxns.wardFilter({"id": "4", "constituency": "5"})
                ).toBe(false);

                expect(
                    data.$scope.filterFxns.ownerFilter({"id": "1", "owner_type": "1"})
                ).toBe(true);
                expect(
                    data.$scope.filterFxns.ownerFilter({"id": "2", "owner_type": "2"})
                ).toBe(true);
                expect(
                    data.$scope.filterFxns.ownerFilter({"id": "3", "owner_type": "3"})
                ).toBe(true);

                data.$scope.filters.multiple.owner_type = [
                    {"id": "1"}, {"id": "2"}
                ];
                expect(
                    data.$scope.filterFxns.ownerFilter({"id": "1", "owner_type": "1"})
                ).toBe(true);
                expect(
                    data.$scope.filterFxns.ownerFilter({"id": "2", "owner_type": "2"})
                ).toBe(true);
                expect(
                    data.$scope.filterFxns.ownerFilter({"id": "3", "owner_type": "3"})
                ).toBe(false);
            });

            it("should load state", function () {
                state.go("facility_filter");
            });
        });

        describe("test results controller", function () {

            it("should find facilities using the filters", function () {
                var data = {
                    "$scope": rootScope.$new(),
                    "filterParams": {
                        "county": "12",
                        "page": 3,
                        "constituency": undefined
                    }
                };
                httpBackend
                    .expectGET(server_url+"api/facilities/facilities_list/?county=12&page=3")
                    .respond(200, {results: []});

                ctrl("results", data);

                httpBackend.flush();
                httpBackend.verifyNoOutstandingExpectation();
                httpBackend.verifyNoOutstandingRequest();
            });

            it("should fail to find facilities using the filters", function () {
                var data = {
                    "$scope": rootScope.$new(),
                    "filterParams": {
                        "county": "12",
                        "page": 3,
                        "constituency": undefined
                    }
                };
                httpBackend
                    .expectGET(server_url+"api/facilities/facilities_list/?county=12&page=3")
                    .respond(500, {});

                ctrl("results", data);

                httpBackend.flush();
                httpBackend.verifyNoOutstandingExpectation();
                httpBackend.verifyNoOutstandingRequest();
            });

            it("should export all filtered facilities to excel", function () {
                inject(["api.auth", function (a) {
                    var data = {
                        "$scope": rootScope.$new(),
                        "filterParams": {
                            "county": "12",
                            "page": 3,
                            "constituency": undefined
                        },
                        "$window": {
                            location: {}
                        },
                        "api.auth": a
                    };
                    httpBackend
                        .expectGET(server_url+"api/facilities/facilities_list/?county=12&page=3")
                        .respond(200, {
                            count: 10,
                            results: []
                        });

                    spyOn(a, "getToken").andReturn({access_token: 21});
                    ctrl("results", data);

                    httpBackend.flush();
                    httpBackend.verifyNoOutstandingExpectation();
                    httpBackend.verifyNoOutstandingRequest();

                    data.$scope.excelExport();
                    expect(a.getToken).toHaveBeenCalled();

                    var url = data.$window.location.href;
                    expect(url).toContain("access_token=21");
                    expect(url).toContain("page_size=10");
                    expect(url).toContain("county=12");
                    expect(url).not.toContain("page=");
                    expect(url).not.toContain("constituency=");
                    expect(url).toContain("format=excel");
                }]);
            });

            it("should go to the next page", function () {
                var data = {
                    "$scope": rootScope.$new(),
                    "$state": state,
                    "filterParams": {
                        "county": "12",
                        "page": 3,
                        "constituency": undefined
                    }
                };
                httpBackend
                    .expectGET(server_url+"api/facilities/facilities_list/?county=12&page=3")
                    .respond(200, {
                        "count": 8361,
                        "current_page": 4,
                        "next": "http://localhost:8061/api/facilities/facilities_list/?page=5",
                        "page_size": 25,
                        "previous": "http://localhost:8061/api/facilities/facilities_list/?page=3",
                        "results": [],
                        "total_pages": 335
                    });

                spyOn(state, "go");
                ctrl("results", data);

                httpBackend.flush();
                httpBackend.verifyNoOutstandingExpectation();
                httpBackend.verifyNoOutstandingRequest();

                data.$scope.nextPage();

                expect(state.go).toHaveBeenCalled();
                expect(state.go.calls[0].args[1].page).toEqual(5);

                data.$scope.results.total_pages = 1;
                data.$scope.results.current_page = 1;
                data.$scope.nextPage();
                expect(state.go.calls.length).toEqual(1);
            });

            it("should go to the previous page", function () {
                var data = {
                    "$scope": rootScope.$new(),
                    "$state": state,
                    "filterParams": {
                        "county": "12",
                        "page": 3,
                        "constituency": undefined
                    }
                };
                httpBackend
                    .expectGET(server_url+"api/facilities/facilities_list/?county=12&page=3")
                    .respond(200, {
                        "count": 8361,
                        "current_page": 4,
                        "next": "http://localhost:8061/api/facilities/facilities_list/?page=5",
                        "page_size": 25,
                        "previous": "http://localhost:8061/api/facilities/facilities_list/?page=3",
                        "results": [],
                        "total_pages": 335
                    });

                spyOn(state, "go");
                ctrl("results", data);

                httpBackend.flush();
                httpBackend.verifyNoOutstandingExpectation();
                httpBackend.verifyNoOutstandingRequest();

                data.$scope.prevPage();

                expect(state.go).toHaveBeenCalled();
                expect(state.go.calls[0].args[1].page).toEqual(3);

                data.$scope.results.current_page = 1;
                data.$scope.prevPage();
                expect(state.go.calls.length).toEqual(1);
            });
        });
    });

})();
