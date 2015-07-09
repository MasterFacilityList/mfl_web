(function(describe, it){
    "use strict";

    describe("GIS County api Wrapper", function(){
        var httpBackend, gisAdminUnitsApi, SERVER_URL;

        beforeEach(function () {
            module("mfl.gis.wrapper", "mflAppConfig");

            inject(["gisAdminUnitsApi", function(gadmin_units) {
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

        it("should have keyName defined for localForage",inject(["$localForage","$rootScope",
        function ($localForage,$rootScope) {
                var data = {results: {}, count: 0};
                var promise = {
                    then: angular.noop
                };
                spyOn($localForage, "key").andReturn(promise);
                spyOn($localForage, "getItem").andReturn(promise);
                spyOn(promise, "then");

                gisAdminUnitsApi.getCounties();
                var then_fxn1 = promise.then.calls[0].args[0];
                expect(angular.isFunction(then_fxn1)).toBe(true);
                then_fxn1("mflApp.counties");
                $rootScope.$digest();

                $localForage.getItem("mflApp.counties");
                expect($localForage.getItem).toHaveBeenCalledWith("mflApp.counties");
                expect(promise.then).toHaveBeenCalled();

                var then_fxn2 = promise.then.calls[1].args[0];
                expect(angular.isFunction(then_fxn2)).toBe(true);
                then_fxn2(data);
                httpBackend.verifyNoOutstandingRequest();
                httpBackend.verifyNoOutstandingExpectation();
            }]));
    });
})(describe, it);
