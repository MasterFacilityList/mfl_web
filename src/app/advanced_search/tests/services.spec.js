"use strict";
(function(){
    describe("Filtering: services", function(){
        var service, $httpBackend, serverUrl;
        beforeEach(module("mflwebApp"));
        beforeEach(inject(["$httpBackend","SERVER_URL","mfl.filtering.data.controller",
            function( $_httpBackend, SERVER_URL, filterApi){
            $httpBackend = $_httpBackend;
            service = filterApi;
            serverUrl = SERVER_URL;
        }]));

        it("should have `mfl.filtering.data.controller` service defined", function(){
            expect(service).toBeDefined();
        });
        it("should init dropdown lists", function(){
            console.log(service());
        });
    });
})();
