(function (angular) {
    "use strict";

    describe("Tests for mfl.gis.controllers.gis_const (Constituency Level):", function () {
        var controller, scope, root, state, httpBackend, SERVER_URL;

        beforeEach(function () {
            module("mflwebApp");
            module("mfl.gis_const.controllers");
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
                    $stateParams.const_id = 4;
                    $stateParams.const_boundaries = "4,2,41";
                    $stateParams.ward_boundaries = "4,2,41";

                    controller = function (cntrl, data) {
                        return $controller(cntrl, data);
                    };
                }]);
        });

        it("should load mfl.gis.controller.gis_const", inject(["$httpBackend",
            "$state", "leafletData",
            function ($httpBackend, $state, leafletData) {
            var data1 = {
                properties: {
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
                        constituency_id:"4",
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
            SERVER_URL + "api/gis/constituency_boundaries/4/")
                .respond(200, data1);
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/coordinates/?fields=geometry,constituency&constituency=4")
                .respond(200, data2);
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/ward_boundaries/?id=4")
                .respond(200, data1);
            controller("mfl.gis.controllers.gis_const", {
                "$scope": scope,
                "leafletData": leafletData,
                "$http": {},
                "$state": {},
                "$stateParams": {county_id: 4, const_id: 4, ward_boundaries: 4},
                "SERVER_URL": SERVER_URL
            });
            scope.const_id = 4;
            scope.ward_boundaries = 4;
            $httpBackend.flush();
        }]));
        it("should fail to load data (Const Level)",
           inject(["$httpBackend",
            function ($httpBackend) {
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/county_boundaries/4/")
                .respond(500, {});
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/constituency_boundaries/4/")
                .respond(500, {});
            controller("mfl.gis.controllers.gis_const", {
                "$scope": scope,
                "$http": {},
                "$state": {},
                "$stateParams": {county_id: 4, const_id: 4, ward_boundaries: 4},
                "SERVER_URL": SERVER_URL
            });
            $httpBackend.flush();
        }]));
        it("should expect broadcast of leafletDirectiveGeoJson.mouseover(Constituency Level)",
            inject(["$rootScope","leafletData","$httpBackend", function ($rootScope,
            leafletData,$httpBackend) {
            var data1 = {
                properties: {
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
                        constituency_id:"4",
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
            SERVER_URL + "api/gis/constituency_boundaries/4/")
                .respond(200, data1);
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/coordinates/?fields=geometry,constituency&constituency=4")
                .respond(200, data2);
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/ward_boundaries/?id=4")
                .respond(200, data1);
            var scope = $rootScope.$new();
            controller("mfl.gis.controllers.gis_const", {
                "$scope": scope,
                "leafletData": leafletData,
                "$http": {},
                "$state": {},
                "$stateParams": {county_id: 4, const_id: 4, ward_boundaries: 4},
                "SERVER_URL": SERVER_URL
            });
            $httpBackend.flush();
            var ward = {
                model:{
                    type : "",
                    id: "",
                    geometry : {},
                    properties : {}
                }
            };
            $rootScope.$broadcast("leafletDirectiveGeoJson.constmap.mouseover", ward);
            scope.hoveredWard = {
                type : "",
                id: "",
                geometry : {},
                properties : {}
            };
            expect(scope.hoveredWard).toEqual(ward.model);
        }]));

        it("should expect broadcast of leafletDirectiveGeoJson.click(Constituency Level)",
           inject(["$state","leafletData","$httpBackend",
           function ($state, leafletData,$httpBackend) {
            var data1 = {
                properties: {
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
                        constituency_id:"4",
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
            SERVER_URL + "api/gis/constituency_boundaries/4/")
                .respond(200, data1);
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/coordinates/?fields=geometry,constituency&constituency=4")
                .respond(200, data2);
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/ward_boundaries/?id=4")
                .respond(200, data1);
            spyOn(scope, "$on").andCallThrough();
            spyOn($state, "go");
            controller("mfl.gis.controllers.gis_const", {
                "$scope": scope,
                "leafletData": leafletData,
                "$http": {},
                "$state": $state,
                "$stateParams": {county_id:4,const_id: 4,county_boundaries:4,ward_boundaries: 4},
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
            var second_call = scope.$on.calls[1];
            expect(second_call.args[0]).toEqual("leafletDirectiveGeoJson.constmap.click");
            expect(angular.isFunction(second_call.args[1])).toBe(true);
            var listener = second_call.args[1];
            listener(null, ward);
            expect($state.go).toHaveBeenCalled();
        }]));
        it("should get leaflet data map(Constituency Level)",
        inject(["$state","leafletData","$httpBackend",
        function ($state, leafletData,$httpBackend) {
            var data1 = {
                properties: {
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
                        constituency_id:"4",
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
            SERVER_URL + "api/gis/constituency_boundaries/4/")
                 .respond(200, data1);
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/coordinates/?fields=geometry,constituency&constituency=4")
                 .respond(200, data2);
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/ward_boundaries/?id=4")
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
            controller("mfl.gis.controllers.gis_const", {
                "$scope": scope,
                "leafletData": leafletData,
                "$http": {},
                "$state": $state,
                "$stateParams": {county_id: 4, const_id: 4, ward_boundaries: 4},
                "$timeout": timeout.timeout,
                "SERVER_URL": SERVER_URL
            });
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
        }]));
    });
})(window.angular);
