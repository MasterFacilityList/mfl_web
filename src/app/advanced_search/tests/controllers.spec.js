(function(){
    "use strict";
    describe("Advanced Filtering : Controller", function(){
        var createController, rootScope, httpBackend, serverUrl;
        var filterApi, $window;
        var facilityUrl = "api/facilities/facilities/";
        var filterData  = {
            county:{
                data: {results: []}
            },
            constituency: {
                data: {results: []}
            },
            operation_status: {
                data: {results: []}
            },
            facility_type: {
                data: {results: []}
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
            inject(["$rootScope","$controller","$httpBackend", "filteringApi",
                   "SERVER_URL",
                function($rootScope, $controller, $httpBackend, filteringApi, SERVER_URL){
                    rootScope = $rootScope;
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
                    serverUrl+facilityUrl+"?search=name").respond(200, {results: ["testing"]});
            createController(
                scope, {"search": "name"}, undefined, undefined, true);
            httpBackend.flush();
            expect(scope.query_results).toEqual(["testing"]);
        });
        it("should filter facilities: search param set: success, empty results", function(){
            var scope = rootScope.$new();
            httpBackend.expectGET(
                    serverUrl+facilityUrl+"?search=name").respond(200, {results: []});
            createController(
                scope, {"search": "name"}, undefined, undefined, true);
            httpBackend.flush();
            expect(scope.spinneractive).toEqual(false);
        });
        it("should filter facilities: search param set: fail", function(){
            var scope = rootScope.$new();
            httpBackend.expectGET(
                    serverUrl+facilityUrl+"?search=name").respond(500, {error: "serve error"});
            createController(
                scope, {"search": "name"}, undefined, undefined, true);
            httpBackend.flush();
            expect(scope.spinneractive).toEqual(false);
        });

        it("should filter facility by county: success", function(){
            var scope = rootScope.$new();
            createController(scope, {});

            httpBackend.expectGET(
                    serverUrl+facilityUrl+"?county=21212").respond(200, {results: ["testing"]});
            scope.filterFacility({county :[{id: "21212"}]});
            httpBackend.flush();
            expect(scope.query_results).toEqual(["testing"]);
        });


        it("should filter facility by county: fail", function(){
            var scope = rootScope.$new();
            createController(scope, {});
            httpBackend.expectGET(
                    serverUrl+facilityUrl+"?county=21212").respond(500, {error: "server err"});
            scope.filterFacility({county :[{id: "21212"}]});
            httpBackend.flush();
            expect(scope.spinneractive).toEqual(false);
        });
        it("should filter facility by operation_status", function(){
            var scope = rootScope.$new();
            createController(scope, {});

            httpBackend.expectGET(
                    serverUrl+facilityUrl+"?operation_status=true").respond(200,
                    {results: ["testing"]});
            scope.filterFacility({"operation_status" :true});
            httpBackend.flush();
            expect(scope.query_results).toEqual(["testing"]);
        });

        it("should filter facility, no filter", function(){
            var scope = rootScope.$new();
            spyOn(filterApi.facilities, "filter");
            createController(scope, {});
            scope.filterFacility({});
            expect(filterApi.facilities.filter).not.toHaveBeenCalled();
        });

        it("should filter facility: param with no id set", function(){
            var scope = rootScope.$new();
            createController(scope, {});

            httpBackend.expectGET(
                    serverUrl+facilityUrl+"?county=true").respond(200,
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
                    serverUrl+facilityUrl+"?ward=21212").respond(200, {results: ["testing"]});
            scope.filterFacility({ward :[{id: "21212"}], county :[{id: "fa21212"}]});
            httpBackend.flush();
            expect(scope.query_results).toEqual(["testing"]);
        });
        it("should filter facility by constituency, remove county", function(){
            var scope = rootScope.$new();
            createController(scope, {});

            httpBackend.expectGET(
                    serverUrl+facilityUrl+"?constituency=21212")
                    .respond(200, {results: ["testing"]});
            scope.filterFacility({constituency :[{id: "21212"}], county :[{id: "fa21212"}]});
            httpBackend.flush();
            expect(scope.query_results).toEqual(["testing"]);
        });

        it("should export data", function(){
            var scope = rootScope.$new();
            createController(scope, {});

            httpBackend.expectGET(
                    serverUrl+facilityUrl+"?format=excel")
                    .respond(200, {results: ["testing"]});
            scope.excelExport();
            httpBackend.flush();
            expect(scope.filter.format).toBeFalsy();
        });

        it("should filter facilities: county param set: success, empty results", function(){
            var scope = rootScope.$new();
            httpBackend.expectGET(
                    serverUrl+facilityUrl).respond(200, {results: []});
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
                    serverUrl+facilityUrl).respond(200, {results: []});
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
                    serverUrl+facilityUrl).respond(200, {results: []});
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
                    serverUrl+facilityUrl).respond(200, {results: []});
            httpBackend.expectGET(
                    serverUrl+"api/common/wards/?id=1,2,3&page_size=2000")
                    .respond(500, {error: "server error"});
            createController(
                scope, {"ward": "1,2,3"}, undefined, undefined, true);
            httpBackend.flush();
            expect(scope.alert).toEqual("server error");
        });

        it("should filter facilities: unknow param set", function(){
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
    });
})();
