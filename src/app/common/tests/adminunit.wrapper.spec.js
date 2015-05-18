"use strict";
(function(){
    describe("Admin Units tests suite", function(){
        var httpBackend, countiesApi,constsApi,wardsApi,townsApi, SERVER_URL;
        beforeEach(function(){
            module("mfl.adminunits.wrapper", "mflAppConfig");
            inject(["countiesApi","constsApi","wardsApi","townsApi",
                function(countsA,constsA,wardsA,townsA){
                countiesApi = countsA;
                constsApi = constsA;
                wardsApi = wardsA;
                townsApi = townsA;
            }]);
            inject(["$httpBackend", "SERVER_URL", function($httpBackend, url){
                httpBackend = $httpBackend;
                SERVER_URL = url;
            }]);
        });
        afterEach(inject([ function(){
            httpBackend.verifyNoOutstandingRequest();
        }]));

        it("should have countiesApi defined", function(){
            expect(countiesApi).toBeDefined();
        });
        it("should have constsApi defined", function(){
            expect(constsApi).toBeDefined();
        });
        it("should have wardsApi defined", function(){
            expect(wardsApi).toBeDefined();
        });
        it("should have townsApi defined", function(){
            expect(townsApi).toBeDefined();
        });

    });
})();
