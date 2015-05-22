/*
*
*
**********TESTS FOR COUNTY LEVEL************
*
*
*/

describe("Tests for mfl.gis_county.controllers.gis (County Level):", function () {
    "use strict";
    var controller, scope, root, state, httpBackend, SERVER_URL;

    beforeEach(function () {
        module("mflwebApp");
        module("mfl.gis_county.controllers");
        module("mfl.gis.wrapper");
        module("mfl.gis.routes");

        inject(["$rootScope", "$controller","$httpBackend","$state","$stateParams",
                "SERVER_URL","countiesApi","constsApi","gisCountiesApi","gisConstsApi",
                "gisWardsApi",
            function ($rootScope, $controller, $httpBackend, $state,$stateParams,
                  url, countiesApi,constsApi, gisCountiesApi, gisConstsApi,gisWardsApi) {
                root = $rootScope;
                scope = root.$new();
                state = $state;
                httpBackend = $httpBackend;
                SERVER_URL = url;
                countiesApi = countiesApi;
                gisCountiesApi = gisCountiesApi;
                gisConstsApi = gisConstsApi;
                gisWardsApi = gisWardsApi;
                $stateParams.county_id = 4;
                $stateParams.const_boundaries = "4,2,41";
                $stateParams.ward_boundaries = "4,2,41";
                $stateParams.ward_id = "3";
                constsApi = constsApi;

                controller = function (cntrl, data) {
                    return $controller(cntrl, data);
                };
            }]);
    });

    it("should load mfl.gis.controller.gis_county (County Level)", inject(["$httpBackend","$state",
                 "leafletData","gisConstsApi","gisCountiesApi",
        function ($httpBackend, $state, leafletData,gisConstsApi,gisCountiesApi) {
        var data = {
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
        $httpBackend.expectGET(
        SERVER_URL + "api/gis/county_boundaries/34/")
            .respond(200, data);
        $httpBackend.expectGET(
        SERVER_URL + "api/gis/coordinates/?county=4")
            .respond(200, data);
        $httpBackend.expectGET(
        SERVER_URL + "api/gis/constituency_boundaries/?id=undefined")
            .respond(200, data);
        $state.go("gis_county", {"county_id": "34"});
        controller("mfl.gis.controllers.gis_county", {
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
            "$http": {},
            "$state": {},
            "$stateParams": {},
            "SERVER_URL": SERVER_URL,
            "gisConstsApi": gisConstsApi,
            "gisCountiesApi": gisCountiesApi
        });
        $httpBackend.flush();
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
            "$http": {},
            "$state": {},
            "$stateParams": {},
            "SERVER_URL": SERVER_URL
        });
        $httpBackend.expectGET(
        SERVER_URL + "api/gis/coordinates/?county=4")
            .respond(500, data);
        $httpBackend.expectGET(
        SERVER_URL + "api/gis/constituency_boundaries/?id=undefined")
            .respond(500, data);
        $httpBackend.flush();
    }]));
    it("should expect broadcast of leafletDirectiveGeoJson.mouseover(County Level)",
        inject(["$rootScope","leafletData","gisCountiesApi","gisConstsApi","$state",
                function ($rootScope, leafletData,gisCountiesApi,gisConstsApi,$state) {
        $state.go("gis_county", {"county_id": "34"});
        controller("mfl.gis.controllers.gis_county", {
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
            "$http": {},
            "$state": {},
            "$stateParams": {},
            "SERVER_URL": SERVER_URL,
            "gisConstsApi": gisConstsApi,
            "gisCountiesApi": gisCountiesApi
        });
        var constituency = {
            model:{
                type : "",
                id: "",
                geometry : {},
                properties : {}
            }
        };
        $rootScope.$broadcast("leafletDirectiveGeoJson.mouseover",constituency);
        scope.hoveredConst = {
            type : "",
            id: "",
            geometry : {},
            properties : {}
        };
        expect(scope.hoveredConst).toEqual(constituency.model);
    }]));
    
    it("should expect broadcast of leafletDirectiveGeoJson.click(County Level)",
       inject(["$state","leafletData","gisCountiesApi","gisConstsApi",
               function ($state, leafletData,gisCountiesApi,gisConstsApi) {
        spyOn(scope, "$on").andCallThrough();
        spyOn($state, "go");
        controller("mfl.gis.controllers.gis_county", {
            "$scope": scope,
            "leafletData": leafletData,
            "gisCounty": {
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
            "SERVER_URL": SERVER_URL,
            "gisConstsApi": gisConstsApi,
            "gisCountiesApi": gisCountiesApi
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
        var second_call = scope.$on.calls[1];
        expect(second_call.args[0]).toEqual("leafletDirectiveGeoJson.click");
        expect(angular.isFunction(second_call.args[1])).toBe(true);
        var listener = second_call.args[1];
        listener(null, constituency);
        expect($state.go).toHaveBeenCalledWith("gis_const",{const_id: "",
                                               ward_boundaries: "a,b"});
    }]));

    it("should get leaflet data map(County Level)",
       inject(["$state", "leafletData","gisCountiesApi","gisConstsApi",
               function ($state, leafletData,gisCountiesApi,gisConstsApi) {
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
            "gisCounty": {
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
            "SERVER_URL": SERVER_URL,
            "gisConstsApi": gisConstsApi,
            "gisCountiesApi": gisCountiesApi
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
