(function (angular) {
    "use strict";

    describe("Tests for mfl.gis.controllers.gis_const (Constituency Level):", function () {
        var controller, scope, root, state, httpBackend, SERVER_URL,gisAdminUnitsApi;

        beforeEach(function () {
            module("mflwebApp");
            module("mfl.gis_const.controllers");
            module("mfl.gis.wrapper");
            module("mfl.gis.routes");

            inject(["$rootScope", "$controller","$httpBackend","$state","$stateParams",
                "SERVER_URL","gisAdminUnitsApi",
                function ($rootScope, $controller, $httpBackend, $state,$stateParams, url,gis_api) {
                    root = $rootScope;
                    scope = root.$new();
                    state = $state;
                    httpBackend = $httpBackend;
                    gisAdminUnitsApi = gis_api;
                    SERVER_URL = url;
                    $stateParams.county_code = 4;
                    $stateParams.constituency_code = 4;
                    controller = function (cntrl, data) {
                        return $controller(cntrl, data);
                    };
                }]);
        });

        it("should load mfl.gis.controller.gis_const", inject(["$httpBackend",
            "$state", "leafletData",
            function ($httpBackend, $state, leafletData) {
            var data1 = {
                meta: {
                    bound:{
                        type:"",
                        coordinates:[[3,4],[4,5]]
                    },
                    id:4,
                    center:{
                        type:"",
                        coordinates:[[3,4],[4,5]]
                    }
                },
                geojson:{
                    id :4,
                    type:"",
                    geometry:{},
                    properties: {},
                    features: [
                        {
                            id:"",
                            type:"",
                            geometry:{
                                type:"",
                                coordinates:[[3,4],[4,5]]
                            },
                            properties:{
                                bound:{
                                    type:"",
                                    coordinates:[[3,4],[4,5]]
                                },
                                constituency_id:"4",
                                center:{
                                    type:"",
                                    coordinates:[[3,4],[4,5]]
                                }
                            }
                        }
                    ]
                }
            };
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/drilldown/constituency/4/")
                .respond(200, data1);

            var promise = {then: angular.noop};
            spyOn(gisAdminUnitsApi, "getFacCoordinates").andReturn(promise);
            spyOn(promise, "then");

            controller("mfl.gis.controllers.gis_const", {
                "$scope": scope,
                "leafletData": leafletData,
                "$http": {},
                "$state": {},
                "$stateParams": {county_code: 4,constituency_code:4},
                "SERVER_URL": SERVER_URL
            });

            gisAdminUnitsApi.getFacCoordinates();
            scope.layers.overlays ={};
            scope.county_code = 4;
            scope.constituency_code = 4;
            $httpBackend.flush();

            expect(gisAdminUnitsApi.getFacCoordinates).toHaveBeenCalled();
            expect(promise.then).toHaveBeenCalled();
            var success_fxn = promise.then.calls[0].args[0];
            var error_fxn = promise.then.calls[0].args[1];

            error_fxn({"error": "ADS"});

            success_fxn(data1);
        }]));
        it("should fail to load data (Const Level)",
           inject(["$httpBackend",
            function ($httpBackend) {
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/drilldown/constituency/4/")
                .respond(500, {});
            controller("mfl.gis.controllers.gis_const", {
                "$scope": scope,
                "$http": {},
                "$state": {},
                "$stateParams": {county_code: 4, constituency_code: 4, ward_boundaries: 4},
                "SERVER_URL": SERVER_URL
            });
            $httpBackend.flush();
        }]));

        it("should expect broadcast of leafletDirectiveGeoJson.click(Constituency Level)",
           inject(["$state","leafletData","$httpBackend",
           function ($state, leafletData,$httpBackend) {
            var data1 = {
                meta: {
                    bound:{
                        type:"",
                        coordinates:[[3,4],[4,5]]
                    },
                    constituency_id:"4",
                    center:{
                        type:"",
                        coordinates:[[3,4],[4,5]]
                    }
                },
                geojson:{
                    id :"4",
                    type:"",
                    geometry:{},
                    properties: {},
                    features: [
                        {
                            id:"",
                            type:"",
                            geometry:{
                                type:"",
                                coordinates:[[3,4],[4,5]]
                            },
                            properties:{
                                bound:{
                                    type:"",
                                    coordinates:[[3,4],[4,5]]
                                },
                                constituency_id:"4",
                                center:{
                                    type:"",
                                    coordinates:[[3,4],[4,5]]
                                }
                            }
                        }
                    ]
                }
            };
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/drilldown/constituency/4/")
                .respond(200, data1);
            spyOn(scope, "$on").andCallThrough();
            spyOn($state, "go");
            controller("mfl.gis.controllers.gis_const", {
                "$scope": scope,
                "leafletData": leafletData,
                "$http": {},
                "$state": $state,
                "$stateParams": {county_code:4,constituency_code: 4,ward_code: 4},
                "SERVER_URL": SERVER_URL
            });
            $httpBackend.flush();
            var ward = {
                model:{
                    type : "",
                    id: 1,
                    geometry : {},
                    properties : {
                        ward_boundary_ids: [
                            "a",
                            "b"
                        ],
                        center:{
                            coordinates : [
                                "12",
                                "13"
                            ]
                        }
                    }
                }
            };
            var second_call = scope.$on.calls[0];
            expect(second_call.args[0]).toEqual("leafletDirectiveGeoJson.constmap.click");
            expect(angular.isFunction(second_call.args[1])).toBe(true);
            var listener = second_call.args[1];
            listener(null, ward);
            expect($state.go).toHaveBeenCalled();
        }]));

        it("should expect broadcast of leafletDirectiveMarker.click(Constituency Level)",
           inject(["$state","leafletData","$httpBackend",
           function ($state, leafletData,$httpBackend) {
            var data1 = {
                meta: {
                    bound:{
                        type:"",
                        coordinates:[[3,4],[4,5]]
                    },
                    constituency_id:4,
                    center:{
                        type:"",
                        coordinates:[[3,4],[4,5]]
                    }
                },
                geojson:{
                    id :4,
                    type:"",
                    geometry:{},
                    properties: {},
                    features: [
                        {
                            id:"",
                            type:"",
                            geometry:{
                                type:"",
                                coordinates:[[3,4],[4,5]]
                            },
                            properties:{
                                bound:{
                                    type:"",
                                    coordinates:[[3,4],[4,5]]
                                },
                                constituency_id:4,
                                center:{
                                    type:"",
                                    coordinates:[[3,4],[4,5]]
                                }
                            }
                        }
                    ]
                }
            };
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/drilldown/constituency/4/")
                .respond(200, data1);
            spyOn(scope, "$on").andCallThrough();
            spyOn($state, "go");
            controller("mfl.gis.controllers.gis_const", {
                "$scope": scope,
                "leafletData": leafletData,
                "$http": {},
                "$state": $state,
                "$stateParams": {county_code:4,constituency_code: 4},
                "SERVER_URL": SERVER_URL
            });
            $httpBackend.flush();
            var ward = {
                model:{
                    type : "",
                    id: 1,
                    boundaries: [
                            "a",
                            "b"
                        ]
                    }
                };
            var second_call = scope.$on.calls[1];
            expect(second_call.args[0]).toEqual("leafletDirectiveMarker.constmap.click");
            expect(angular.isFunction(second_call.args[1])).toBe(true);
            var listener = second_call.args[1];
            listener(null, ward);
            expect($state.go).toHaveBeenCalled();
        }]));

        it("should get leaflet data map(Constituency Level)",
        inject(["$state","leafletData","$httpBackend",
        function ($state, leafletData,$httpBackend) {
            var data1 = {
                meta: {
                    bound:{
                        type:"",
                        coordinates:[[3,4],[4,5]]
                    },
                    constituency_id:"4",
                    center:{
                        type:"",
                        coordinates:[[3,4],[4,5]]
                    }
                },
                geojson:{
                    id :"4",
                    type:"",
                    geometry:{},
                    properties: {},
                    features: [
                        {
                            id:"",
                            type:"",
                            geometry:{
                                type:"",
                                coordinates:[[3,4],[4,5]]
                            },
                            properties:{
                                bound:{
                                    type:"",
                                    coordinates:[[3,4],[4,5]]
                                },
                                constituency_id:"4",
                                center:{
                                    type:"",
                                    coordinates:[[3,4],[4,5]]
                                }
                            }
                        }
                    ]
                }
            };
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/drilldown/constituency/4/")
                .respond(200, data1);
            spyOn(scope, "$on").andCallThrough();
            spyOn($state, "go");
            var obj = {
                then: angular.noop
            };
            var timeout = {
                timeout: angular.noop
            };
            spyOn(leafletData, "getMap").andReturn(obj);
            spyOn(obj, "then");
            spyOn(timeout, "timeout");

            var promise = {then: angular.noop};
            spyOn(gisAdminUnitsApi, "getFacCoordinates").andReturn(promise);
            spyOn(promise, "then");

            controller("mfl.gis.controllers.gis_const", {
                "$scope": scope,
                "leafletData": leafletData,
                "$http": {},
                "$state": $state,
                "gisAdminUnitsApi": gisAdminUnitsApi,
                "$stateParams": {county_code: 4, constituency_code: 4, ward_code: 4},
                "$timeout": timeout.timeout,
                "SERVER_URL": SERVER_URL
            });

            gisAdminUnitsApi.getFacCoordinates();
            httpBackend.flush();
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

            expect(map.fitBounds).toHaveBeenCalled();
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

            error_fxn({"error": "ADIS"});
            expect(scope.alert).toEqual("ADIS");

            var payload = [
                ["A",1,2,3,4,5],
                ["B",2,3,4,5,6]
            ];
            success_fxn(payload);
        }]));
    });
})(window.angular);
