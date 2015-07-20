(function (angular) {
    "use strict";

    describe("Tests for mfl.gis.controllers.gis_ward (Ward Level):", function () {

        var controller, scope, root, state, httpBackend, SERVER_URL;

        beforeEach(function () {
            module("mflwebApp");
            module("mfl.gis_ward.controllers");
            module("mfl.gis.wrapper");
            module("mfl.gis.routes");

            inject(["$rootScope", "$controller","$httpBackend","$state","$stateParams",
                    "SERVER_URL",
                function ($rootScope, $controller, $httpBackend, $state,$stateParams, url) {
                    root = $rootScope;
                    scope = root.$new();
                    state = $state;
                    httpBackend = $httpBackend;
                    SERVER_URL = url;
                    $stateParams.ward_id = 4;
                    controller = function (cntrl, data) {
                        return $controller(cntrl, data);
                    };
                }]);
        });

        it("should load mfl.gis.controller.gis_ward", inject(["$httpBackend","$state",
                     "leafletData",
            function ($httpBackend, $state, leafletData) {
            var data2 = [
                {
                    geometry:{
                        type:"",
                        coordinates:[]
                    },
                    properties:{
                        bound:{
                            type:"",
                            coordinates:[[3,4],[4,5]]
                        },
                        center:{
                            type:"",
                            coordinates:[[3,4],[4,5]]
                        }
                    }
                }
            ];
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/coordinates/?ward=4")
                .respond(200, data2);
            controller("mfl.gis.controllers.gis_ward", {
                "$scope": scope,
                "leafletData": leafletData,
                "gisCounty": {
                    data: {
                        properties: {
                            bound: {
                                coordinates: []
                            },
                            county_id:"4"
                        }
                    }
                },
                "gisConst": {
                    data: {
                        properties: {
                            bound: {
                                coordinates: []
                            }
                        }
                    }
                },
                "gisWard": {
                    data: {
                        properties: {
                            bound: {
                                coordinates: []
                            },
                            ward_id:"4"
                        }
                    }
                },
                "$http": {},
                "$state": {},
                "$stateParams": {ward_id: 4},
                "SERVER_URL": SERVER_URL
            });
            $httpBackend.flush();
        }]));
        it("should fail to load data (Ward Level)",
           inject(["$httpBackend",
            function ($httpBackend) {
            var data = {
                results:{
                    id :"",
                    type:"",
                    features: [
                        {
                            id: "",
                            geometry:{
                                type:"",
                                coordinates:[0,1]
                            },
                            properties:{
                                facility_name:""
                            }
                        }
                    ],
                    geometry:{},
                    properties: {}
                }
            };
            controller("mfl.gis.controllers.gis_ward", {
                "$scope": scope,
                "gisCounty": {
                    data: {
                        properties: {
                            bound: {
                                coordinates: []
                            },
                            county_id:"4"
                        }
                    }
                },
                "gisConst": {
                    data: {
                        properties: {
                            bound: {
                                coordinates: []
                            }
                        }
                    }
                },
                "gisWard": {
                    data: {
                        properties: {
                            bound: {
                                coordinates: []
                            },
                            ward_id:"4"
                        }
                    }
                },
                "$http": {},
                "$state": {},
                "$stateParams": {},
                "SERVER_URL": SERVER_URL
            });
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/coordinates/?ward=4")
                .respond(500, data);
            $httpBackend.flush();
        }]));

        it("should get leaflet data map(Ward Level)",
           inject(["$state", "leafletData", function ($state, leafletData) {
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
            controller("mfl.gis.controllers.gis_ward", {
                "$scope": scope,
                "leafletData": leafletData,
                "gisCounty": {
                    data: {
                        properties: {
                            bound: {
                                coordinates: []
                            },
                            county_id:"4"
                        }
                    }
                },
                "gisConst": {
                    data: {
                        properties: {
                            bound: {
                                coordinates: []
                            }
                        }
                    }
                },
                "gisWard": {
                    data: {
                        properties: {
                            bound: {
                                "type": "Polygon",
                                "coordinates": [
                                    [ [1, 2], [3, 4] ]
                                ]
                            }
                        }
                    }
                },
                "$http": {},
                "$state": $state,
                "$stateParams": {},
                "$timeout": timeout.timeout,
                "SERVER_URL": SERVER_URL
            });

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
        }]));
    });
})(window.angular);
