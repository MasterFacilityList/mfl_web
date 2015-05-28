
(function(){
    "use strict";
    describe("Filtering: routes", function(){
        var $state, serverUrl, httpBackend, $rootScope;
        beforeEach(function(){
            module("mfl.filtering");
            module("mflAppConfig");
            module("templates-app");
            module("templates-common");
        });
        beforeEach(function(){
            inject(["$rootScope", "$state","$httpBackend", "SERVER_URL",
             function($_rootScope, _$state, $httpBackend, SERVER_URL){
                $state = _$state;
                $rootScope = $_rootScope;
                serverUrl = SERVER_URL;
                httpBackend = $httpBackend;
            }]);
        });

        it("should go to filtering page: fetch options from backend", function(){
            httpBackend.expectGET(serverUrl+"api/common/filtering_summaries/")
                .respond(200, {});
            $state.go("filtering");
            expect($state.href("filtering")).toEqual("#/filtering");
            httpBackend.flush();
        });

        it("should go to filtering page: use already fetch options", function(){
            httpBackend.expectGET(serverUrl+"api/common/filtering_summaries/")
                .respond(200, {});
            $rootScope.mflFilteringData = {data: {count: []}};
            $state.go("filtering");
            expect($state.href("filtering")).toEqual("#/filtering");
            expect(httpBackend.flush).toThrow();
        });
    });
})();
