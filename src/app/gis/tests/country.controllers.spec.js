describe("Tests for mfl.gis.controllers.gis (Country Level):", function () {
    "use strict";

    var controller, httpBackend, SERVER_URL, gisCountriesApi, gisAdminUnitsApi,
        gisCountiesApi, gisFacilitiesApi, leafletData;

    beforeEach(function () {
        module("mflwebApp");
        module("ui.router");
        module("mfl.gis_country.controllers");
        module("mfl.gis.wrapper");
        module("mfl.gis.routes");
        module("ui.router");

        inject(["$rootScope", "$controller","$httpBackend","$state","$stateParams",
                "SERVER_URL","gisCountriesApi","gisCountiesApi","gisFacilitiesApi","leafletData",
                "gisAdminUnitsApi",
            function ($rootScope, $controller, $httpBackend, $state,$stateParams,
                  url, gis_countries_api, gis_counties_api, gis_facilities_api, leaflet_data,
                    gis_admin_units_api) {
                httpBackend = $httpBackend;
                SERVER_URL = url;
                gisCountriesApi = gis_countries_api;
                gisCountiesApi = gis_counties_api;
                gisFacilitiesApi = gis_facilities_api;
                gisAdminUnitsApi = gis_admin_units_api;
                leafletData = leaflet_data;
                $stateParams.county_id = 4;
                $stateParams.const_boundaries = "4,2,41";
                $stateParams.ward_boundaries = "4,2,41";
                $stateParams.ward_id = "3";

                controller = function (cntrl, data) {
                    return $controller(cntrl, data);
                };
            }]);
    });

    it("should load mfl.gis.controller.gis (Country Level)",
       inject(["$httpBackend", "$rootScope", function ($httpBackend, $rootScope) {
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
        SERVER_URL + "api/gis/coordinates/")
            .respond(200, data2);
        controller("mfl.gis.controllers.gis", {
            "$scope": $rootScope.$new(),
            "leafletData": leafletData,
            "$http": {},
            "$state": {},
            "$stateParams": {},
            "SERVER_URL": SERVER_URL,
            "gisCountriesApi": gisCountriesApi,
            "gisCountiesApi": gisCountiesApi,
            "gisFacilitiesApi": gisFacilitiesApi
        });
        $httpBackend.flush();
    }]));
    
    it("should fail to load data (Country Level)",
       inject(["$httpBackend", "$rootScope", function ($httpBackend, $rootScope) {
        var data = {
            count: 1,
            results:{
                type:"",
                features:[
                    {
                        id:"",
                        type:"",
                        properties:{
                            bound:{
                                type:"",
                                coordinates:[[3,4],[4,5]]
                            }
                        }
                    }
                ],
                geometry:{},
                properties: {}
            }
        };
        controller("mfl.gis.controllers.gis", {
            "$scope": $rootScope.$new(),
            "leafletData": leafletData,
            "$http": {},
            "$state": {},
            "$stateParams": {},
            "SERVER_URL": SERVER_URL
        });
//        $httpBackend.expectGET(
//        SERVER_URL + "api/gis/county_boundaries/")
//            .respond(500, data);
        $httpBackend.expectGET(
        SERVER_URL + "api/gis/coordinates/")
            .respond(500, data);
        $httpBackend.flush();
    }]));
    
    it("should expect broadcast of leafletDirectiveGeoJson.mouseover(Country)",
        inject(["$rootScope", "$state", function ($rootScope, $state) {
        var scope = $rootScope.$new();
        controller("mfl.gis.controllers.gis", {
            "$scope" : scope,
            "$state" : $state,
            "gisCountriesApi" : gisCountriesApi,
            "gisCountiesApi" : gisCountiesApi,
            "gisFacilitiesApi": gisFacilitiesApi,
            "leafletData": leafletData,
            "SERVER_URL": SERVER_URL
        });
        var county = {
            model:{
                type : "",
                id: "",
                geometry : {},
                properties : {}
            }
        };
        $rootScope.$broadcast("leafletDirectiveGeoJson.mouseover", county);
        expect(scope.hoveredCounty).toEqual(county.model);
    }]));
    
    it("should expect broadcast of leafletDirectiveGeoJson.click(Country)",
       inject(["$state", "$rootScope", function ($state, $rootScope) {
        var scope = $rootScope.$new();
        spyOn(scope, "$on").andCallThrough();
        spyOn($state, "go");
        controller("mfl.gis.controllers.gis", {
            "$scope" : scope,
            "$state" : $state,
            "gisCountriesApi" : gisCountriesApi,
            "gisCountiesApi" : gisCountiesApi,
            "gisFacilitiesApi": gisFacilitiesApi,
            "leafletData": leafletData,
            "SERVER_URL": SERVER_URL
        });
        var county = {
            model: {
                type : "",
                id: "",
                geometry : {},
                properties : {
                    constituency_boundary_ids: [
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
        listener(null, county);
        expect($state.go).toHaveBeenCalledWith("gis.gis_county",{county_id: "",
                                               const_boundaries: "a,b"});
    }]));
    
    it("should get leaflet data map(Country Level)",
       inject(["$state", "$httpBackend", "$rootScope",
               function ($state, $httpBackend, $rootScope) {
//        var data1 = {
//            count: 1,
//            results:{
//                type:"",
//                features:[
//                    {
//                        id:"",
//                        type:"",
//                        geometry:{
//                            type:"",
//                            coordinates:[]
//                        },
//                        properties:{
//                            bound:{
//                                type:"",
//                                coordinates:[
//                                    [-4.669618,33.907219],
//                                    [-4.669618,41.90516700000012],
//                                    [4.622499,41.90516700000012],
//                                    [4.622499,33.907219],
//                                    [-4.669618,33.907219]
//                                ]
//                            },
//                            center:{
//                                type:"",
//                                coordinates:[[3,4],[4,5]]
//                            }
//                        }
//                    }
//                ],
//                geometry:{
//                    type:"",
//                    coordinates:[]
//                },
//                properties: {}
//            }
//        };
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
        var obj = {
            then: angular.noop
        };
        var timeout = {
            timeout: angular.noop
        };
        var scope = $rootScope.$new();
        spyOn(scope, "$on").andCallThrough();
        spyOn($state, "go");
        spyOn(leafletData, "getMap").andReturn(obj);
        spyOn(obj, "then");
        spyOn(timeout, "timeout");
        controller("mfl.gis.controllers.gis", {
            "$scope": scope,
            "leafletData": leafletData,
            "$http": {},
            "$state": $state,
            "$stateParams": {},
            "SERVER_URL": SERVER_URL,
            "gisCountriesApi": gisCountriesApi,
            "gisCountiesApi": gisCountiesApi,
            "gisAdminUnitsApi": gisAdminUnitsApi,
            "gisFacilitiesApi": gisFacilitiesApi,
            "$timeout": timeout.timeout
        });
        $httpBackend.expectGET(
        SERVER_URL + "api/gis/coordinates/")
            .respond(200, data2);
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
        expect(map.fitBounds).toHaveBeenCalledWith([[-4.669618,33.907219],
                                    [-4.669618,41.90516700000012],
                                    [4.622499,41.90516700000012],
                                    [4.622499,33.907219],
                                    [-4.669618,33.907219]]);
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
