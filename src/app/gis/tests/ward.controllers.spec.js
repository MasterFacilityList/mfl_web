(function (angular) {
    "use strict";

    describe("Tests for mfl.gis.controllers.gis_ward (Ward Level):", function () {

        var controller, scope, root, state, httpBackend, SERVER_URL,gisAdminUnitsApi;

        beforeEach(function () {
            module("mflwebApp");
            module("mfl.gis_ward.controllers");
            module("mfl.gis.wrapper");
            module("mfl.gis.routes");

            inject(["$rootScope", "$controller","$httpBackend","$state","$stateParams",
                    "SERVER_URL","gisAdminUnitsApi",
                function ($rootScope, $controller, $httpBackend, $state,$stateParams, url,gis_api) {
                    root = $rootScope;
                    scope = root.$new();
                    state = $state;
                    gisAdminUnitsApi = gis_api;
                    httpBackend = $httpBackend;
                    SERVER_URL = url;
                    $stateParams.ward_code = 4;
                    controller = function (cntrl, data) {
                        return $controller(cntrl, data);
                    };
                }]);
        });
        it("should expect fetch of data to fail",
        inject(["$httpBackend",function($httpBackend) {
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/drilldown/ward/4/")
                .respond(500, {});
            controller("mfl.gis.controllers.gis_ward", {
                "$scope": scope,
                "$stateParams": {ward_code: 4, county_code: 4, const_code: 4},
                "SERVER_URL": SERVER_URL
            });
            $httpBackend.flush();
        }]));
        it("should get leaflet data map(Ward Level)",
           inject(["$state", "leafletData","$httpBackend",
           function ($state, leafletData, $httpBackend) {
            spyOn(scope, "$on").andCallThrough();
            spyOn($state, "go");
            var obj = {
                then: angular.noop
            };
            var timeout = {
                timeout: angular.noop
            };
            var data1 = {
                properties: {
                    bound: {
                        type: "Polygon",
                        coordinates: [
                            [ [1, 2], [3, 4] ]
                        ]
                    },
                    ward_id:"4",
                    facility_coordinates:[
                        {
                            geometry:{
                                type:"",
                                coordinates:[0,1]
                            },
                            name: "Sasa Hospital"
                        }
                    ]
                }
            };
            spyOn(leafletData, "getMap").andReturn(obj);
            spyOn(obj, "then");
            spyOn(timeout, "timeout");
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/drilldown/ward/4/")
                .respond(200, data1);

            var promise = {then: angular.noop};
            spyOn(gisAdminUnitsApi, "getFacCoordinates").andReturn(promise);
            spyOn(promise, "then");

            controller("mfl.gis.controllers.gis_ward", {
                "$scope": scope,
                "leafletData": leafletData,
                "$state": $state,
                "$stateParams": {ward_code: 4, county_code: 4, const_code: 4},
                "$timeout": timeout.timeout,
                "gisAdminUnitsApi": gisAdminUnitsApi,
                "SERVER_URL": SERVER_URL
            });
            gisAdminUnitsApi.getFacCoordinates();
            scope.county_code = 4;
            $httpBackend.flush();
            expect(leafletData.getMap).toHaveBeenCalled();
            expect(obj.then).toHaveBeenCalled();

            var then_fxn = obj.then.calls[0].args[0];
            expect(angular.isFunction(then_fxn)).toBe(true);
            var map = {
                fitBounds: angular.noop,
                spin: angular.noop
            };
            spyOn(map, "fitBounds");
            spyOn(map, "spin");
            then_fxn(map);

            expect(map.fitBounds).toHaveBeenCalledWith([[2,1 ], [4, 3]]);
            expect(map.spin).toHaveBeenCalledWith(
                true, {lines: 13, length: 20,corners:1,radius:30,width:10});
            expect(map.spin.calls[0].args[0]).toBe(true);
            expect(timeout.timeout).toHaveBeenCalled();

            var timeout_fxn = timeout.timeout.calls[0].args[0];
            expect(angular.isFunction(timeout.timeout.calls[0].args[0])).toBe(true);
            timeout_fxn();
            expect(map.spin.calls.length).toBe(2);
            expect(map.spin.calls[1].args[0]).toBe(false);

            expect(gisAdminUnitsApi.getFacCoordinates).toHaveBeenCalled();
            expect(promise.then).toHaveBeenCalled();
            var success_fxn = promise.then.calls[0].args[0];
            var error_fxn = promise.then.calls[0].args[1];
            var payload = [
                ["A",1,2,3,4,5]
            ];
            success_fxn(payload);
            error_fxn({"error": "ADIS"});
            expect(scope.alert).toEqual("ADIS");
        }]));
    });
})(window.angular);
