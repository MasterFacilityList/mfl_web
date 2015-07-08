"use strict";
(function(describe, it){
    describe("GIS County api Wrapper", function(){
        var httpBackend, gisCountriesApi,gisCountiesApi,gisConstsApi,
            gisAdminUnitsApi,gisWardsApi, SERVER_URL;
        beforeEach(function () {
            module("mfl.gis.wrapper", "mflAppConfig");

            inject(["gisCountriesApi","gisCountiesApi","gisWardsApi","gisConstsApi",
                "gisAdminUnitsApi",
                function(gcountries,gcounties,gconsts,gwards,gadmin_units){
                gisCountriesApi = gcountries;
                gisCountiesApi = gcounties;
                gisConstsApi = gconsts;
                gisWardsApi = gwards;
                gisAdminUnitsApi =  gadmin_units;
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
        it("should have gisAdminUnitsApi defined", function(){
            expect(gisAdminUnitsApi).toBeDefined();
        });
        it("should have keyName as null for localForage succeeds api call",inject(["$localForage",
            function ($localForage) {
                var keyName = {
                    then : angular.noop
                };
                spyOn($localForage, "key").andReturn(keyName);
                spyOn(keyName, "then");

                httpBackend.expectGET(SERVER_URL+"api/gis/county_boundaries/")
                    .respond(200,{"Accept":"application/json, */*"});
                gisAdminUnitsApi.getCounties();
                var then_fxn = keyName.then.calls[0].args[0];
                expect(angular.isFunction(then_fxn)).toBe(true);
                then_fxn(null);

                httpBackend.flush();
                httpBackend.verifyNoOutstandingExpectation();
                httpBackend.verifyNoOutstandingRequest();
            }]));
        it("should have keyName as null for localForage fails api call",inject(["$localForage",
            function ($localForage) {
                var keyName = {
                    then : angular.noop
                };
                spyOn($localForage, "key").andReturn(keyName);
                spyOn(keyName, "then");

                httpBackend.expectGET(SERVER_URL+"api/gis/county_boundaries/")
                    .respond(500,{"Accept":"application/json, */*"});
                gisAdminUnitsApi.getCounties();
                var then_fxn = keyName.then.calls[0].args[0];
                expect(angular.isFunction(then_fxn)).toBe(true);
                then_fxn(null);

                httpBackend.flush();
                httpBackend.verifyNoOutstandingExpectation();
                httpBackend.verifyNoOutstandingRequest();
            }]));
        it("should have keyName defined for localForage",inject(["$localForage",
        function ($localForage) {
                var key_name= "mflApp.counties";
                var data = {};
                var keyName = {
                    then : angular.noop
                };
                var keyItem = {
                    then : angular.noop
                };
                spyOn($localForage, "key").andReturn(keyName);
                spyOn(keyName, "then");
                gisAdminUnitsApi.getCounties();
                var then_fxn1 = keyName.then.calls[0].args[0];
                expect(angular.isFunction(then_fxn1)).toBe(true);
                then_fxn1(key_name);
                spyOn($localForage, "getItem").andReturn(keyItem);
                spyOn(keyItem, "then");
                var then_fxn2 = keyItem.then.calls[0].args[0];
                expect(angular.isFunction(then_fxn2)).toBe(true);
                then_fxn2(data);
            }]));
         
    });
})(describe, it);
