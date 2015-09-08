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
                               "ward,operation_status,service_category," +
                               "owner_type,owner,service,keph_level")
                    .respond(200, {});

                ctrl("form", data);

                httpBackend.flush();
                httpBackend.verifyNoOutstandingRequest();
                httpBackend.verifyNoOutstandingExpectation();

                expect(data.$scope.filter_summaries).toEqual({});
            });

            it("should update filters from params", function () {
                var data = {
                    "$scope": rootScope.$new(),
                    "$state": state,
                    "$stateParams": {
                        "name": "ASD",
                        "number_of_cots": "34",
                        "open_weekends": "true",
                        "open_whole_day": "false",
                        "open_public_holidays": "jksd",
                        "county": "1,2",
                        "constituency": "11,31,42",
                        "ward": "111,231"
                    }
                };

                httpBackend
                    .expectGET(server_url+"api/common/filtering_summaries/" +
                               "?fields=county,facility_type,constituency," +
                               "ward,operation_status,service_category," +
                               "owner_type,owner,service,keph_level")
                    .respond(200, {
                        county: [{"id": "1"}, {"id": "2"}, {"id": "3"}],
                        constituency: [
                            {"id": "11", "county": "1"},
                            {"id": "12", "county": "1"},
                            {"id": "31", "county": "3"}
                        ],
                        ward: [
                            {"id": "111", "constituency": "11"},
                            {"id": "311", "constituency": "31"},
                            {"id": "231", "constituency": "23"}
                        ]
                    });

                spyOn(state, "go");
                ctrl("form", data);

                httpBackend.flush();
                httpBackend.verifyNoOutstandingRequest();
                httpBackend.verifyNoOutstandingExpectation();

                expect(data.$scope.filters.single.name).toEqual("ASD");
                expect(data.$scope.filters.single.number_of_cots).toEqual("34");
                expect(data.$scope.filters.single.open_weekends).toEqual("true");
                expect(data.$scope.filters.single.open_whole_day).toEqual("false");
                expect(data.$scope.filters.single.open_public_holidays).toEqual("jksd");

                expect(data.$scope.filters.multiple.county)
                    .toEqual([{"id": "1"}, {"id": "2"}, {"id": "3"}]);
                expect(data.$scope.filters.multiple.constituency)
                    .toEqual([{"id": "11","county": "1"}, {"id": "31","county": "3"}]);
                expect(data.$scope.filters.multiple.ward)
                    .toEqual([{"id":"111","constituency":"11"}, {"id":"231","constituency":"23"}]);
            });

            it("should clear bool filters", function () {
                var data = {
                    "$scope": rootScope.$new(),
                    "$state": state
                };

                httpBackend
                    .expectGET(server_url+"api/common/filtering_summaries/" +
                               "?fields=county,facility_type,constituency," +
                               "ward,operation_status,service_category," +
                               "owner_type,owner,service,keph_level")
                    .respond(200, {});

                spyOn(state, "go");
                ctrl("form", data);

                httpBackend.flush();
                httpBackend.verifyNoOutstandingRequest();
                httpBackend.verifyNoOutstandingExpectation();

                data.$scope.filters.single.open_public_holidays = "true";
                data.$scope.bool_clear();
                expect(data.$scope.filters.single.open_public_holidays).toEqual("");
            });

            it("should filter facilities", function () {
                var data = {
                    "$scope": rootScope.$new(),
                    "$state": state
                };

                httpBackend
                    .expectGET(server_url+"api/common/filtering_summaries/" +
                               "?fields=county,facility_type,constituency," +
                               "ward,operation_status,service_category," +
                               "owner_type,owner,service,keph_level")
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
                expect(state.go).toHaveBeenCalled();
                expect(state.go.calls[0].args[0]).toEqual("facility_filter.results");
                expect(state.go.calls[0].args[1].county).toEqual("3");
            });

            it("should clear filter facilities", function () {
                var data = {
                    "$scope": rootScope.$new(),
                    "$state": state
                };

                httpBackend
                    .expectGET(server_url+"api/common/filtering_summaries/" +
                               "?fields=county,facility_type,constituency," +
                               "ward,operation_status,service_category," +
                               "owner_type,owner,service,keph_level")
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
                               "ward,operation_status,service_category," +
                               "owner_type,owner,service,keph_level")
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

                expect(
                    data.$scope.filterFxns.serviceFilter({"id": "1", "category": "1"})
                ).toBe(true);
                expect(
                    data.$scope.filterFxns.serviceFilter({"id": "2", "category": "2"})
                ).toBe(true);
                expect(
                    data.$scope.filterFxns.serviceFilter({"id": "3", "category": "3"})
                ).toBe(true);

                data.$scope.filters.multiple.service_category = [
                    {"id": "1"}, {"id": "2"}
                ];
                expect(
                    data.$scope.filterFxns.serviceFilter({"id": "1", "category": "1"})
                ).toBe(true);
                expect(
                    data.$scope.filterFxns.serviceFilter({"id": "2", "category": "2"})
                ).toBe(true);
                expect(
                    data.$scope.filterFxns.serviceFilter({"id": "3", "category": "3"})
                ).toBe(false);
            });
        });

        describe("test results controller", function () {

            var default_url;
            beforeEach(function () {
                default_url = server_url+"api/facilities/facilities/?" +
                              "fields=id,code,name,regulatory_status_name," +
                              "facility_type_name,owner_name,county,"+
                              "constituency,ward_name,keph_level,operation_status_name&";
            });

            it("should find facilities using the filters", function () {
                var data = {
                    "$scope": rootScope.$new(),
                    "filterParams": {
                        "county": "12",
                        "page": 3,
                        "constituency": undefined
                    }
                };
                httpBackend.expectGET(default_url+"county=12&page=3").respond(200, {results: []});

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
                httpBackend.expectGET(default_url+"county=12&page=3").respond(500, {});

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
                    httpBackend.expectGET(default_url+"county=12&page=3")
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
                    .expectGET(default_url+"county=12&page=3")
                    .respond(200, {
                        "count": 8361,
                        "current_page": 4,
                        "next": "http://localhost:8061/api/facilities/facilities/?page=5",
                        "page_size": 25,
                        "previous": "http://localhost:8061/api/facilities/facilities/?page=3",
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
                    .expectGET(default_url+"county=12&page=3")
                    .respond(200, {
                        "count": 8361,
                        "current_page": 4,
                        "next": "http://localhost:8061/api/facilities/facilities/?page=5",
                        "page_size": 25,
                        "previous": "http://localhost:8061/api/facilities/facilities/?page=3",
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

        describe("test indeterminate directive", function () {

            it("should watch and toggle indeterminate", function () {
                inject(["$compile", function ($compile) {
                    var html = "<input type=\"checkbox\" ng-model=\"bool_val\"" +
                        " ng-true-value=\"'true'\" ng-false-value=\"'false'\"" +
                        " indeterminate-value />";
                    var scope = rootScope.$new();
                    var element = $compile(html)(scope);

                    scope.bool_val = "true";
                    scope.$apply();
                    expect(element[0].indeterminate).toBe(false);

                    scope.bool_val = "false";
                    scope.$apply();
                    expect(element[0].indeterminate).toBe(false);

                    scope.bool_val = "";
                    scope.$apply();
                    expect(element[0].indeterminate).toBe(true);
                }]);
            });
        });

    });

})();
