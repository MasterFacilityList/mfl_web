"use strict";
(function(describe, it){
    describe("GIS County api Wrapper", function(){
        var httpBackend, gisCountriesApi,gisCountiesApi,gisConstsApi,gisWardsApi, SERVER_URL;
        beforeEach(function () {
            module("mfl.gis.wrapper", "mflAppConfig");

            inject(["gisCountriesApi","gisCountiesApi","gisWardsApi","gisConstsApi",
                function(gcountries,gcounties,gconsts,gwards){
                gisCountriesApi = gcountries;
                gisCountiesApi = gcounties;
                gisConstsApi = gconsts;
                gisWardsApi = gwards;
            }]);

            inject(["$httpBackend", "SERVER_URL", function(hb, url){
                httpBackend = hb;
                SERVER_URL = url;
            }]);
        });
        afterEach(inject([function(){
            httpBackend.verifyNoOutstandingRequest();
        }]));

        it("should have gisCountriesApi defined", function(){
            expect(gisCountriesApi).toBeDefined();
        });
        it("should have gisCountiesApi defined", function(){
            expect(gisCountiesApi).toBeDefined();
        });
        it("should have gisConstsApi defined", function(){
            expect(gisConstsApi).toBeDefined();
        });
        it("should have gisWardsApi defined", function(){
            expect(gisWardsApi).toBeDefined();
        });
    });
})(describe, it);
