(function (angular) {
    "use strict";
    describe("Chul controllers: ", function () {
        var rootScope, ctrl, httpBackend, server_url,
        controller, stateParams, state;

        beforeEach(function () {
            module("mflAppConfig");
            module("mfl.chul.routes");
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

        describe("test view controller", function () {

            beforeEach(function() {
                inject(["api.auth", function (auth) {
                    spyOn(auth, "getToken").andReturn({
                        "access_token": "345"
                    });
                }]);
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
                data.$scope.unit_id = 1;
                data.$scope.getUnitRating();
                data.$scope.printCU(data.$scope.unit_id);
                httpBackend.flush();
                httpBackend.verifyNoOutstandingRequest();
                httpBackend.verifyNoOutstandingExpectation();
            });

            it("should test rateCU function" , function () {
                var data = {
                    "$scope": rootScope.$new(),
                    "$stateParams": {
                        unit_id: 1
                    },
                    "$state" : state
                };
                spyOn(state, "go");
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

        describe("test search form controller", function () {

            var default_url;

            beforeEach(function () {
                default_url = server_url + "api/common/filtering_summaries/" +
                               "?fields=county,constituency,ward,chu_status";
            });

            it("should load filter summaries", function () {
                var data = {
                    "$scope": rootScope.$new()
                };

                httpBackend.expectGET(default_url).respond(200, {});

                ctrl("search_form", data);

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
                        "county": "1,2",
                        "constituency": "11,31,42",
                        "ward": "111,231"
                    }
                };

                httpBackend.expectGET(default_url)
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
                ctrl("search_form", data);

                httpBackend.flush();
                httpBackend.verifyNoOutstandingRequest();
                httpBackend.verifyNoOutstandingExpectation();

                expect(data.$scope.filters.single.name).toEqual("ASD");

                expect(data.$scope.filters.multiple.county)
                    .toEqual([{"id": "1"}, {"id": "2"}, {"id": "3"}]);
                expect(data.$scope.filters.multiple.constituency)
                    .toEqual([{"id": "11","county": "1"}, {"id": "31","county": "3"}]);
                expect(data.$scope.filters.multiple.ward)
                    .toEqual([{"id":"111","constituency":"11"}, {"id":"231","constituency":"23"}]);
            });

            it("should filter CHUs", function () {
                var data = {
                    "$scope": rootScope.$new(),
                    "$state": state
                };

                httpBackend.expectGET(default_url).respond(200, {});

                spyOn(state, "go");
                ctrl("search_form", data);

                httpBackend.flush();
                httpBackend.verifyNoOutstandingRequest();
                httpBackend.verifyNoOutstandingExpectation();

                data.$scope.filters.multiple.county = [{"id": "3"}];
                data.$scope.filterCHUs();
                expect(state.go).toHaveBeenCalled();
                expect(state.go.calls[0].args[0]).toEqual("chul_filter.results");
                expect(state.go.calls[0].args[1].county).toEqual("3");
            });

            it("should clear filter", function () {
                var data = {
                    "$scope": rootScope.$new(),
                    "$state": state
                };

                httpBackend.expectGET(default_url).respond(200, {});

                spyOn(state, "go");
                ctrl("search_form", data);

                httpBackend.flush();
                httpBackend.verifyNoOutstandingRequest();
                httpBackend.verifyNoOutstandingExpectation();

                data.$scope.filters.multiple.county = [{"id": "3"}];
                data.$scope.clearFilters();
                expect(state.go).toHaveBeenCalledWith("chul_filter", {});
            });

            it("should filter lists", function () {
                var data = {
                    "$scope": rootScope.$new(),
                    "$state": state
                };

                httpBackend.expectGET(default_url).respond(200, {});

                spyOn(state, "go");
                ctrl("search_form", data);

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
            });
        });

        describe("test search results controller", function () {

            var default_url;
            beforeEach(function () {
                default_url = server_url+"api/chul/units/?" +
                              "fields=id,code,name,status_name,date_established," +
                              "facility,facility_name,facility_county," +
                              "facility_subcounty,facility_ward&";
            });

            it("should find CHUs using the filters", function () {
                var data = {
                    "$scope": rootScope.$new(),
                    "filterParams": {
                        "county": "12",
                        "page": 3,
                        "constituency": undefined
                    }
                };
                httpBackend.expectGET(default_url+"county=12&page=3").respond(200, {results: []});

                ctrl("search_results", data);

                httpBackend.flush();
                httpBackend.verifyNoOutstandingExpectation();
                httpBackend.verifyNoOutstandingRequest();
            });

            it("should handle fail to find CHUs using the filters", function () {
                var data = {
                    "$scope": rootScope.$new(),
                    "filterParams": {
                        "county": "12",
                        "page": 3,
                        "constituency": undefined
                    }
                };
                httpBackend.expectGET(default_url+"county=12&page=3").respond(500, {});

                ctrl("search_results", data);

                httpBackend.flush();
                httpBackend.verifyNoOutstandingExpectation();
                httpBackend.verifyNoOutstandingRequest();
            });

            it("should export all filtered fCHUs to excel", function () {
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
                    ctrl("search_results", data);

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
                        "next": "http://localhost:8061/api/chul/units/?page=5",
                        "page_size": 25,
                        "previous": "http://localhost:8061/api/chul/units/?page=3",
                        "results": [],
                        "total_pages": 335
                    });

                spyOn(state, "go");
                ctrl("search_results", data);

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
                        "next": "http://localhost:8061/api/chul/units/?page=5",
                        "page_size": 25,
                        "previous": "http://localhost:8061/api/chul/units/?page=3",
                        "results": [],
                        "total_pages": 335
                    });

                spyOn(state, "go");
                ctrl("search_results", data);

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
})(window.angular);
