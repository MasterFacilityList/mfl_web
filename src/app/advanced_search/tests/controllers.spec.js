(function(){
    "use strict";
    describe("Advanced Filtering : Controller", function(){
        var createController, rootScope, httpBackend, serverUrl;
        var filterApi, $window, $compile;
        var default_params = "?is_classified=false&is_published=true";
        var facilityUrl = "api/facilities/facilities/"+default_params;
        var filterData  = {
            data: {
                county: [],
                constituency: [],
                operation_status: [],
                facility_type: [],
                git: [],
                owner_type: [],
                owner: []
            }
        };
        beforeEach(function(){
            module("mfl.filtering", ["$provide" , function($provide){
                $window = {
                    location: {}
                };
                $provide.constant("$window", $window);
            }]);
            module("mflAppConfig");
            module("templates-app");
            module("templates-common");
            inject(["$rootScope","$controller","$httpBackend","$compile",
                    "filteringApi","SERVER_URL",
                function($rootScope, $controller, $httpBackend,compile, filteringApi, SERVER_URL){
                    rootScope = $rootScope;
                    $compile = compile;
                    serverUrl = SERVER_URL;
                    httpBackend = $httpBackend;
                    filterApi = filteringApi;

                    createController = function(scope, stateParams,filteringData, baseRes,
                                                   flush){
                        if(_.isUndefined(baseRes)){
                            baseRes = {code:undefined, data: undefined};
                        }
                        var data = {
                            $scope: scope,
                            filteringData: filterData,
                            $stateParams: stateParams,
                            filteringApi: filteringApi
                        };

                        var ctrl = $controller(
                            "mfl.filtering.controller",data);
                        if(_.isUndefined(flush)){
                            httpBackend.expectGET(
                            serverUrl+facilityUrl).respond(
                                baseRes.code||200, baseRes.data||{results: []});
                            httpBackend.flush();
                        }
                        return ctrl;
                    };
                }]);
        });

        afterEach(function(){
            httpBackend.verifyNoOutstandingRequest();
        });

        it("should have `mfl.filtering.controller` defined", function(){
            var controller = createController({}, {});
            expect(controller).toBeDefined();
        });

        it("should fetch all facilites when no filters set: success", function(){
            var scope = rootScope.$new();
            createController(scope, {}, undefined, {code: 200, data: {results: ["name"]}});
            expect(scope.query_results).toEqual(["name"]);
        });


        it("should fetch all facilites when no filters set: fail", function(){
            var scope = rootScope.$new();
            createController(scope, {}, undefined, {code: 500, data: {results: ["name"]}});
            expect(scope.spinneractive).toEqual(false);
        });

        it("should filter facilities: search param set: success", function(){
            var scope = rootScope.$new();
            httpBackend.expectGET(
                    serverUrl+facilityUrl+"&search=name").respond(200, {results: ["testing"]});
            createController(
                scope, {"search": "name"}, undefined, undefined, true);
            httpBackend.flush();
            expect(scope.query_results).toEqual(["testing"]);
        });

        it("should filter facilities: search param set:delete undefined", function(){
            var scope = rootScope.$new();
            httpBackend.expectGET(
                    serverUrl+facilityUrl+"&search=name").respond(200, {results: ["testing"]});
            createController(
                scope, {"search": "name", "ward": undefined}, undefined, undefined, true);
            httpBackend.flush();
            expect(scope.query_results).toEqual(["testing"]);
        });

        it("should filter facilities: search param set: success, empty results", function(){
            var scope = rootScope.$new();
            httpBackend.expectGET(
                    serverUrl+facilityUrl+"&search=name").respond(200, {results: []});
            createController(
                scope, {"search": "name"}, undefined, undefined, true);
            httpBackend.flush();
            expect(scope.spinneractive).toEqual(false);
        });
        it("should filter facilities: search param set: fail", function(){
            var scope = rootScope.$new();
            httpBackend.expectGET(
                    serverUrl+facilityUrl+"&search=name").respond(500, {error: "serve error"});
            createController(
                scope, {"search": "name"}, undefined, undefined, true);
            httpBackend.flush();
            expect(scope.spinneractive).toEqual(false);
        });

        it("should filter facility by county: success", function(){
            var scope = rootScope.$new();
            createController(scope, {});

            httpBackend.expectGET(
                    serverUrl+facilityUrl+"&county=21212").respond(200, {results: ["testing"]});
            scope.filterFacility({county :[{id: "21212"}]});
            httpBackend.flush();
            expect(scope.query_results).toEqual(["testing"]);
        });


        it("should filter facility by county: fail", function(){
            var scope = rootScope.$new();
            createController(scope, {});
            httpBackend.expectGET(
                    serverUrl+facilityUrl+"&county=21212").respond(500, {error: "server err"});
            scope.filterFacility({county :[{id: "21212"}]});
            httpBackend.flush();
            expect(scope.spinneractive).toEqual(false);
        });
        it("should filter facility by operation_status", function(){
            var scope = rootScope.$new();
            createController(scope, {});

            httpBackend.expectGET(
                    serverUrl+facilityUrl+"&operation_status=true").respond(200,
                    {results: ["testing"]});
            scope.filterFacility({"operation_status" :true});
            httpBackend.flush();
            expect(scope.query_results).toEqual(["testing"]);
        });

        it("should filter facility, no filter", function(){
            var scope = rootScope.$new();
            createController(scope, {});
            httpBackend.expectGET(
                    serverUrl+facilityUrl).respond(200,
                    {results: ["testing"]});
            scope.defaultFilters = {
                is_classified: false,
                is_published: true
            };
            scope.filterFacility({});
            httpBackend.flush();
            expect(scope.query_results).toEqual(["testing"]);
        });

        it("should clear filters", function(){
            var scope = rootScope.$new();
            createController(scope, {});
            createController(scope, {});
            httpBackend.expectGET(
                    serverUrl+facilityUrl).respond(200,
                    {results: ["testing"]});
            scope.defaultFilters = {
                is_classified: false,
                is_published: true
            };
            scope.filter.search = "hapa";
            scope.clearFilters();
            expect(scope.filter.search).toBeFalsy();
            httpBackend.flush();
            expect(scope.query_results).toEqual(["testing"]);
        });

        it("should filter facility: param with no id set", function(){
            var scope = rootScope.$new();
            createController(scope, {});

            httpBackend.expectGET(
                    serverUrl+facilityUrl+"&county=true").respond(200,
                    {results: ["testing"]});
            var testFunc = function(){
                scope.filterFacility({county :[{name: "21212"}]});
                httpBackend.flush();
            };
            expect(testFunc).toThrow();
        });

        it("should filter facility by ward, remove county and consti: success", function(){
            var scope = rootScope.$new();
            createController(scope, {});

            httpBackend.expectGET(
                    serverUrl+facilityUrl+"&ward=21212").respond(200, {results: ["testing"]});
            scope.filterFacility({ward :[{id: "21212"}], county :[{id: "fa21212"}]});
            httpBackend.flush();
            expect(scope.query_results).toEqual(["testing"]);
        });
        it("should filter facility by constituency, remove county", function(){
            var scope = rootScope.$new();
            createController(scope, {});

            httpBackend.expectGET(
                    serverUrl+facilityUrl+"&constituency=21212")
                    .respond(200, {results: ["testing"]});
            scope.filterFacility({constituency :[{id: "21212"}], county :[{id: "fa21212"}]});
            httpBackend.flush();
            expect(scope.query_results).toEqual(["testing"]);
        });

        it("should remove empty filter", function(){
            var scope = rootScope.$new();
            createController(scope, {}, {constituency: undefined, search: "tafuta"});
            expect(scope.query_results).toEqual([]);
        });

        it("should export data", function(){
            var scope = rootScope.$new();
            createController(scope, {});
            scope.excelExport();
            expect($window.location.href).toContain("format=excel");
        });
        it("should export data: params set", function(){
            var scope = rootScope.$new();
            createController(scope, {});
            scope.filter.county = "1";
            scope.excelExport();
            expect($window.location.href).toContain("format=excel");
            expect($window.location.href).toContain("county=1");
        });

        it("should filter facilities: county param set: success, empty results", function(){
            var scope = rootScope.$new();
            httpBackend.expectGET(
                    serverUrl+facilityUrl+"&county=1,2,3").respond(200, {results: []});
            httpBackend.expectGET(
                    serverUrl+"api/common/constituencies/?county=1,2,3&page_size=2000")
                    .respond(200, {results: []});
            createController(
                scope, {"county": "1,2,3"}, undefined, undefined, true);
            httpBackend.flush();
            expect(scope.no_result).toEqual(true);
            expect(scope.filter.county).toEqual([{id: "1"}, {id: "2"}, {id: "3"}]);
        });

        it("should filter facilities:constituency param set: success, empty results", function(){
            var scope = rootScope.$new();
            httpBackend.expectGET(
                    serverUrl+facilityUrl+"&constituency=1,2,3").respond(200, {results: []});
            httpBackend.expectGET(
                    serverUrl+"api/common/wards/?constituency=1,2,3&page_size=2000")
                    .respond(200, {results: []});
            createController(
                scope, {"constituency": "1,2,3"}, undefined, undefined, true);
            httpBackend.flush();
            expect(scope.no_result).toEqual(true);
            expect(scope.filter.constituency).toEqual([{id: "1"}, {id: "2"}, {id: "3"}]);
        });

        it("should filter facilities:ward param set: success, empty results", function(){
            var scope = rootScope.$new();
            httpBackend.expectGET(
                    serverUrl+facilityUrl+"&ward=1,2,3").respond(200, {results: []});
            httpBackend.expectGET(
                    serverUrl+"api/common/wards/?id=1,2,3&page_size=2000")
                    .respond(200, {results: []});
            createController(
                scope, {"ward": "1,2,3"}, undefined, undefined, true);
            httpBackend.flush();
            expect(scope.no_result).toEqual(true);
            expect(scope.filter.ward).toEqual([{id: "1"}, {id: "2"}, {id: "3"}]);
        });

        it("should filter facilities:ward param set: error", function(){
            var scope = rootScope.$new();
            httpBackend.expectGET(
                    serverUrl+facilityUrl+"&ward=1,2,3").respond(200, {results: []});
            httpBackend.expectGET(
                    serverUrl+"api/common/wards/?id=1,2,3&page_size=2000")
                    .respond(500, {error: "server error"});
            createController(
                scope, {"ward": "1,2,3"}, undefined, undefined, true);
            httpBackend.flush();
            expect(scope.alert).toEqual("server error");
        });

        it("should filter facilities: undefiend param set", function(){
            var scope = rootScope.$new();
            httpBackend.expectGET(
                    serverUrl+facilityUrl).respond(200, {results: []});
            httpBackend.expectGET(
                    serverUrl+"api/common/constituencies/?county=1,2,3&page_size=2000")
                    .respond(200, {results: []});

            var testFunc = function(){
                createController(
                scope, {"county": undefined}, undefined, undefined, true);
                httpBackend.flush();
            };
            expect(testFunc).toThrow();
        });

        it("should filter facilities: unknown param set", function(){
            var scope = rootScope.$new();
            httpBackend.expectGET(
                    serverUrl+facilityUrl).respond(200, {results: []});
            httpBackend.expectGET(
                    serverUrl+"api/common/constituencies/?county=1,2,3&page_size=2000")
                    .respond(200, {results: []});

            var testFunc = function(){
                createController(
                scope, {"hapana": "is there"}, {}, undefined, true);
                httpBackend.flush();
            };
            expect(testFunc).toThrow();
        });

        it("should filter on select events: county", function(){
            var scope = rootScope.$new();
            createController(
                scope, { }, undefined, undefined);
            httpBackend.expectGET(
                    serverUrl+"api/common/constituencies/?county=200&page_size=2000")
                    .respond(200, {results: ["name"]});
            scope.events.county.onItemSelect({"id": "200"});
            httpBackend.flush();
            expect(scope.filter_data.constituency).toEqual(["name"]);
        });

        it("should filter on unselect events: county", function(){
            var scope = rootScope.$new();
            createController(
                scope, { }, undefined, undefined);
            httpBackend.expectGET(
                    serverUrl+"api/common/constituencies/?county=200&page_size=2000")
                    .respond(200, {results: ["name"]});
            scope.events.county.onItemSelect({"id": "200"});
            httpBackend.flush();
            expect(scope.filter_data.constituency).toEqual(["name"]);

            httpBackend.expectGET(
                    serverUrl+"api/common/constituencies/?page_size=2000")
                    .respond(200, {results: ["name", "all"]});
            scope.events.county.onItemDeselect({"id": "200"});
            httpBackend.flush();
            expect(scope.filter_data.constituency).toEqual(["name", "all"]);
        });

        it("should filter on select events: constituency", function(){
            var scope = rootScope.$new();
            createController(
                scope, { }, undefined, undefined);
            httpBackend.expectGET(
                    serverUrl+"api/common/wards/?constituency=200&page_size=2000")
                    .respond(200, {results: ["name"]});
            scope.events.constituency.onItemSelect({"id": "200"});
            httpBackend.flush();
            expect(scope.filter_data.ward).toEqual(["name"]);
        });

        it("should filter on unselect events: constituency", function(){
            var scope = rootScope.$new();
            createController(
                scope, { }, undefined, undefined);
            httpBackend.expectGET(
                    serverUrl+"api/common/wards/?constituency=200&page_size=2000")
                    .respond(200, {results: ["name"]});
            scope.events.constituency.onItemSelect({"id": "200"});
            httpBackend.flush();
            expect(scope.filter_data.ward).toEqual(["name"]);

            httpBackend.expectGET(
                    serverUrl+"api/common/wards/?page_size=2000")
                    .respond(200, {results: ["name", "hapa"]});
            scope.events.constituency.onItemDeselect({"id": "200"});
            httpBackend.flush();
            expect(scope.filter_data.ward).toEqual(["name", "hapa"]);
        });

        it("should filter on unselect events: constituency, remove selected", function(){
            var scope = rootScope.$new();
            createController(
                scope, { }, undefined, undefined);

            scope.selected = {constituency : ["200", "300"]};
            scope.$apply();
            httpBackend.expectGET(
                    serverUrl+"api/common/wards/?constituency=200&page_size=2000")
                    .respond(200, {results: ["name", "hapa"]});
            scope.events.constituency.onItemDeselect({"id": "200"});
            httpBackend.flush();
            expect(scope.filter_data.ward).toEqual(["name", "hapa"]);
        });

        it("should filter facility by county: paginate: next", function(){
            var scope = rootScope.$new();
            createController(scope, {});

            httpBackend.expectGET(
                serverUrl+facilityUrl+"&county=21212").respond(
                200,
                {
                    results: ["testing"],
                    count:10,
                    previous: null,
                    next:"http://hapa?page=2"
                }
            );
            scope.filterFacility({county :[{id: "21212"}]});
            httpBackend.flush();
            expect(scope.pagination.next).toEqual(true);
            expect(scope.pagination.prev).toEqual(false);
        });

        it("should filter facility by county: paginate: prev", function(){
            var scope = rootScope.$new();
            createController(scope, {});

            httpBackend.expectGET(
                serverUrl+facilityUrl+"&county=21212").respond(
                200,
                {
                    results: ["testing"],
                    count:10,
                    previous: "http://hapa?page=1",
                    next:"http://hapa?page=3"
                }
            );
            scope.filterFacility({county :[{id: "21212"}]});
            httpBackend.flush();
            expect(scope.pagination.next).toEqual(true);
            expect(scope.pagination.prev).toEqual(true);
        });

        it("should filter facility by county: paginate: no page no.", function(){
            var scope = rootScope.$new();
            createController(scope, {});

            httpBackend.expectGET(
                serverUrl+facilityUrl+"&county=21212").respond(
                200,
                {
                    results: ["testing"],
                    count:10,
                    previous: "http://hapa?param=1",
                    next:"http://hapa?param=3"
                }
            );
            scope.filterFacility({county :[{id: "21212"}]});
            httpBackend.flush();
            expect(scope.pagination.current_page).toBeFalsy();
        });

        it("should should compile paginate directive: prev", function(){
            var scope = rootScope.$new();
            createController(scope, {});
            httpBackend.expectGET(
                serverUrl+facilityUrl+"&county=21212").respond(
                200,
                {
                    results: ["testing"],
                    count:10,
                    previous: "http://hapa?page=1",
                    next:"http://hapa?page=3"
                }
            );
            scope.filterFacility({county :[{id: "21212"}]});
            httpBackend.flush();
            expect(scope.pagination.next).toEqual(true);
            expect(scope.pagination.prev).toEqual(true);
            var paginationDir = $compile("<mfl-pagination></mfl-pagination>")(scope);
            expect(paginationDir.length).toEqual(1);
        });

        it("should should call paginate function", function(){
            var scope = rootScope.$new();
            createController(scope, {});
            spyOn(scope, "filterFacility");
            scope.paginate(21);
            expect(scope.filterFacility).toHaveBeenCalledWith(scope.filter);
        });

        it("should compile advancedSearch directive", function(){
            var chariaDirective = $compile("<advanced_search></advanced_search>")(rootScope.$new());
            expect(chariaDirective.length).toEqual(1);
        });

        it("should compile mflKeyPress directive", function(){
            var keyPressDir = $compile("<div mfl-key-press></div>")(rootScope.$new());
            expect(keyPressDir.length).toEqual(1);
        });

        it("should handle `enter key` press event", function(){
            var scope = rootScope.$new();
            createController(scope, {});
            httpBackend.expectGET(
                serverUrl+facilityUrl).respond(200, {results: ["testing"]});
            var keyPressDir = $compile("<div mfl-key-press></div>")(scope);
            var triggerKeyDown = function (element, keyCode) {
                var e = angular.element.Event("keydown");
                e.which = keyCode;
                element.trigger(e);
            };
            triggerKeyDown(angular.element(keyPressDir), 13);
            httpBackend.flush();
            expect(scope.query_results).toEqual(["testing"]);
        });

        it("should handle `escape key` press event", function(){
            var scope = rootScope.$new();
            createController(scope, {});
            httpBackend.expectGET(
                serverUrl+facilityUrl).respond(200, {results: ["testing"]});
            var keyPressDir = $compile("<div mfl-key-press></div>")(scope);
            var triggerKeyDown = function (element, keyCode) {
                var e = angular.element.Event("keydown");
                e.which = keyCode;
                element.trigger(e);
            };
            triggerKeyDown(angular.element(keyPressDir), 27);
            httpBackend.flush();
            expect(scope.query_results).toEqual(["testing"]);
            expect(scope.filter.search).toBeFalsy();
        });
        it("should assign show-nav class to advanced search ", function(){
            var scope = rootScope.$new();
            createController(scope, {});
            scope.activate_offcanvas = false;
            scope.offCanvas();
            expect(scope.activate_offcanvas).toBeTruthy();
            scope.activate_offcanvas = true;
            scope.offCanvas();
            expect(scope.activate_offcanvas).toBeFalsy();
        });
    });
})();
