"use strict";
(function(){
    describe("Filtering: routes", function(){
        var $state, $location, serverUrl, httpBackend;
        beforeEach(module("mflwebApp"));
        beforeEach(inject(["$state","$location",
                   "$httpBackend", "SERVER_URL",
         function(_$state,
         _$location, $httpBackend, SERVER_URL){
            $state = _$state;
            $location = _$location;
            serverUrl = SERVER_URL;
            httpBackend = $httpBackend;
        }]));

        it("should go to filtering page", function(){

            httpBackend.expectGET(serverUrl+"api/common/counties/?page_size=200")
                .respond(200, {});
            httpBackend.expectGET(serverUrl+"api/common/constituencies/?page_size=200")
                .respond(200, {});
            httpBackend.expectGET(serverUrl+"api/facilities/facility_types/?page_size=200")
                .respond(200, {});
            httpBackend.expectGET(serverUrl+"api/facilities/facility_status/?page_size=200")
                .respond(200, {});
            $state.go("filtering");
            expect($state.href("filtering")).toEqual("#/filtering");
            httpBackend.flush();
        });
    });
})();
