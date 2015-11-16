(function (angular) {
    "use strict";

    describe("Tests for mfl.gis_county.controllers.gis (County Level):", function () {

        var controller, scope, root, state, httpBackend, SERVER_URL;

        beforeEach(function () {
            module("mflwebApp");
            module("mfl.gis_county.controllers");
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
                    $stateParams.county_id = 4;
                    $stateParams.const_boundaries = "4,2,41";
                    $stateParams.ward_boundaries = "4,2,41";
                    $stateParams.ward_id = "3";

                    controller = function (cntrl, data) {
                        return $controller(cntrl, data);
                    };
                }]);
        });

        it("should load mfl.gis.controller.gis_county (County Level)",
            inject(["$httpBackend","$state", "leafletData",
            function ($httpBackend, $state, leafletData) {
            var data1 = {
                properties: {
                    bound:{
                        type:"",
                        coordinates:[[3,4],[4,5]]
                    },
                    county_id:"4",
                    center:{
                        type:"",
                        coordinates:[[3,4],[4,5]]
                    }
                },
                results:{
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
                    ]
                }
            };
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
            SERVER_URL + "api/gis/county_boundaries/4/")
                .respond(200, data1);
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/coordinates/?fields=geometry,county&county=4")
                .respond(200, data2);
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/constituency_boundaries/?id=4")
                .respond(200, data1);
            controller("mfl.gis.controllers.gis_county", {
                "$scope": scope,
                "leafletData": leafletData,
                "$http": {},
                "$state": {},
                "$stateParams": {county_id: 4, const_boundaries: 4},
                "SERVER_URL": SERVER_URL
            });
            $httpBackend.flush();
            scope.county_id = 4;
            scope.layers.overlays = {
                heat : {}
            };
        }]));

        it("should fail to load data (County Level)",
           inject(["$httpBackend",
            function ($httpBackend) {
            var data = {
                results:{
                    id :"",
                    type:"",
                    features:[],
                    geometry:{},
                    properties: {}
                }
            };
            controller("mfl.gis.controllers.gis_county", {
                "$scope": scope,
                "$http": {},
                "$state": {},
                "$stateParams": {county_id: 4, const_boundaries: 4},
                "SERVER_URL": SERVER_URL
            });
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/county_boundaries/4/")
                .respond(500, data);
            $httpBackend.flush();
        }]));

        it("should expect broadcast of leafletDirectiveGeoJson.click(County Level)",
           inject(["$state","leafletData","$httpBackend",
                   function ($state, leafletData, $httpBackend) {
            var data1 = {
                properties: {
                    bound:{
                        type:"",
                        coordinates:[[3,4],[4,5]]
                    },
                    county_id:"4",
                    center:{
                        type:"",
                        coordinates:[[3,4],[4,5]]
                    }
                },
                results:{
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
                    ]
                }
            };
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
            SERVER_URL + "api/gis/county_boundaries/4/")
                .respond(200, data1);
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/coordinates/?fields=geometry,county&county=4")
                .respond(200, data2);
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/constituency_boundaries/?id=4")
                .respond(200, data1);
            spyOn(scope, "$on").andCallThrough();
            spyOn($state, "go");
            controller("mfl.gis.controllers.gis_county", {
                "$scope": scope,
                "leafletData": leafletData,
                "$http": {},
                "$state": $state,
                "$stateParams": {county_id: 4, const_boundaries: 4},
                "SERVER_URL": SERVER_URL
            });

            var constituency = {
                model:{
                    type : "",
                    id: "",
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
            $httpBackend.flush();
            var second_call = scope.$on.calls[0];
            expect(second_call.args[0]).toEqual("leafletDirectiveGeoJson.countymap.click");
            expect(angular.isFunction(second_call.args[1])).toBe(true);
            var listener = second_call.args[1];
            listener(null, constituency);
            expect($state.go).toHaveBeenCalledWith("gis_county.gis_const",{county_id: 4,
                county_boundaries : 4, const_id : "", ward_boundaries : "a,b"});
        }]));

        it("should expect broadcast of leafletDirectiveMarker.click(County Level)",
           inject(["$state","leafletData","$httpBackend",
                   function ($state, leafletData, $httpBackend) {
            var data1 = {
                properties: {
                    bound:{
                        type:"",
                        coordinates:[[3,4],[4,5]]
                    },
                    county_id:"4",
                    center:{
                        type:"",
                        coordinates:[[3,4],[4,5]]
                    }
                },
                results:{
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
                    ]
                }
            };
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
            SERVER_URL + "api/gis/county_boundaries/4/")
                .respond(200, data1);
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/coordinates/?fields=geometry,county&county=4")
                .respond(200, data2);
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/constituency_boundaries/?id=4")
                .respond(200, data1);
            spyOn(scope, "$on").andCallThrough();
            spyOn($state, "go");
            controller("mfl.gis.controllers.gis_county", {
                "$scope": scope,
                "leafletData": leafletData,
                "$http": {},
                "$state": $state,
                "$stateParams": {county_id: 4, const_boundaries: 4},
                "SERVER_URL": SERVER_URL
            });

            var constituency = {
                model:{
                    id: "",
                    boundaries: [
                            "a",
                            "b"
                        ]
                    }
                };
            $httpBackend.flush();
            var second_call = scope.$on.calls[1];
            expect(second_call.args[0]).toEqual("leafletDirectiveMarker.countymap.click");
            expect(angular.isFunction(second_call.args[1])).toBe(true);
            var listener = second_call.args[1];
            listener(null, constituency);
            expect($state.go).toHaveBeenCalledWith("gis_county.gis_const",{county_id: 4,
                county_boundaries : 4, const_id : "", ward_boundaries : "a,b"});
        }]));

        it("should get leaflet data map(County Level)",
           inject(["$state", "leafletData","$httpBackend",
                   function ($state, leafletData,$httpBackend) {
            var data1 = {
                properties: {
                    bound:{
                        type:"",
                        coordinates:[[3,4],[4,5]]
                    },
                    county_id:"4",
                    center:{
                        type:"",
                        coordinates:[[3,4],[4,5]]
                    }
                },
                results:{
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
                    ]
                }
            };
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
            SERVER_URL + "api/gis/county_boundaries/4/")
               .respond(200, data1);
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/coordinates/?fields=geometry,county&county=4")
               .respond(200, data2);
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/constituency_boundaries/?id=4")
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
            controller("mfl.gis.controllers.gis_county", {
                "$scope": scope,
                "leafletData": leafletData,
                "$http": {},
                "$state": $state,
                "$stateParams": {county_id: 4, const_boundaries: 4},
                "$timeout": timeout.timeout,
                "SERVER_URL": SERVER_URL
            });

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
        }]));
    });
})(window.angular);
