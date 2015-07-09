(function () {
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
                    $stateParams.const_id = "34";
                    $stateParams.const_boundaries = "4,2,41";
                    $stateParams.ward_boundaries = "4,2,41";

                    controller = function (cntrl, data) {
                        return $controller(cntrl, data);
                    };
                }]);
        });

        it("should load mfl.gis.controller.gis_const", inject(["$httpBackend","$state",
                     "leafletData",
            function ($httpBackend, $state, leafletData) {
            var data1 = {
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
            SERVER_URL + "api/gis/county_boundaries/34/")
                .respond(200, data1);
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/constituency_boundaries/")
                .respond(200, data1);
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/coordinates/?constituency=4")
                .respond(200, data2);
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/ward_boundaries/?id=undefined")
                .respond(200, data1);
            $state.go("gis.gis_county.gis_const", {"county_id": "34"});
            controller("mfl.gis.controllers.gis_const", {
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
                            },
                            constituency_id:"4"
                        }
                    }
                },
                "$http": {},
                "$state": {},
                "$stateParams": {},
                "SERVER_URL": SERVER_URL
            });
            $httpBackend.flush();
        }]));
        it("should fail to load data (Const Level)",
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
            controller("mfl.gis.controllers.gis_const", {
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
                            },
                            constituency_id:"4"
                        }
                    }
                },
                "$http": {},
                "$state": {},
                "$stateParams": {},
                "SERVER_URL": SERVER_URL
            });
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/coordinates/?constituency=4")
                .respond(500, data);
            $httpBackend.expectGET(
            SERVER_URL + "api/gis/ward_boundaries/?id=undefined")
                .respond(500, data);
            $httpBackend.flush();
        }]));
        it("should expect broadcast of leafletDirectiveGeoJson.mouseover(Constituency Level)",
            inject(["$rootScope","leafletData","$state", function ($rootScope, leafletData,$state) {
            var scope = $rootScope.$new();
            $state.go("gis.gis_county.gis_const", {"const_id": "34"});
            controller("mfl.gis.controllers.gis_const", {
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
                "$http": {},
                "$state": {},
                "$stateParams": {},
                "SERVER_URL": SERVER_URL
            });
            var ward = {
                model:{
                    type : "",
                    id: "",
                    geometry : {},
                    properties : {}
                }
            };
            $rootScope.$broadcast("leafletDirectiveGeoJson.mouseover", ward);
            scope.hoveredWard = {
                type : "",
                id: "",
                geometry : {},
                properties : {}
            };
            expect(scope.hoveredWard).toEqual(ward.model);
        }]));

        it("should expect broadcast of leafletDirectiveGeoJson.click(Constituency Level)",
           inject(["$state","leafletData", function ($state, leafletData) {
            spyOn(scope, "$on").andCallThrough();
            spyOn($state, "go");
            controller("mfl.gis.controllers.gis_const", {
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
                "$http": {},
                "$state": $state,
                "$stateParams": {},
                "SERVER_URL": SERVER_URL
            });

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
            expect(second_call.args[0]).toEqual("leafletDirectiveGeoJson.click");
            expect(angular.isFunction(second_call.args[1])).toBe(true);
            var listener = second_call.args[1];
            listener(null, ward);
            expect($state.go).toHaveBeenCalledWith("gis.gis_county.gis_const.gis_ward",
                                                   {ward_id: 1});
        }]));
        it("should get leaflet data map(Constituency Level)",
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
            controller("mfl.gis.controllers.gis_const", {
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

})();
