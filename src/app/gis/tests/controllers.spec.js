"use strict";

describe("Tests for GIS controllers:", function () {
    var controller, scope, root, data, state, httpBackend, SERVER_URL;

    beforeEach(function () {
        module("mflwebApp");
        module("mfl.gis.controllers");
        module("mfl.gis.wrapper");
        module("mfl.adminunits.wrapper");
        module("mfl.gis.interceptors");

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
                $stateParams.c = "13:12:8";
                constsApi = constsApi;
                data = {
                    $scope : scope,
                    $state : $state,
                    countiesApi : countiesApi,
                    SERVER_URL: url
                };
                controller = function (cntrl) {
                    return $controller(cntrl, data);
                };
            }]);
    });
    it("should expect countiesApi & gisCountiesApi to load list",
            inject(["$httpBackend",function ($httpBackend) {
        controller("mfl.gis.controllers.gis");
        var data = "";
        $httpBackend.expectGET(
        SERVER_URL + "api/common/counties/")
            .respond(200, data);
        $httpBackend.expectGET(
        SERVER_URL + "api/gis/county_boundaries/?format=json&page_size=47")
            .respond(200, data);
        $httpBackend.flush();
    }]));
    it("should expect countiesApi & gisConstsApi to load list(County)",
            inject(["$httpBackend",function ($httpBackend) {
        controller("mfl.gis.controllers.gis_county");
        var data = "";
        $httpBackend.expectGET(
        SERVER_URL + "api/gis/constituency_boundaries/?id=4,2,41&format=json")
            .respond(200, data);
        $httpBackend.flush();
    }]));
    it("should expect constsApi & gisWardsApi to load list(Const)",
            inject(["$httpBackend",function ($httpBackend) {
        controller("mfl.gis.controllers.gis_const");
        var data = "";
        $httpBackend.expectGET(
        SERVER_URL + "api/gis/ward_boundaries/?id=4,2,41&format=json")
            .respond(200, data);
        $httpBackend.flush();
    }]));
    it("should expect gisWardsApi to load list(Ward)",
            inject(["$httpBackend",function ($httpBackend) {
        controller("mfl.gis.controllers.gis_ward");
        var data = "";
        $httpBackend.expectGET(
        SERVER_URL + "api/gis/ward_boundaries/?id=3&format=json")
            .respond(200, data);
        $httpBackend.flush();
    }]));
    it("should expect broadcast of leafletDirectiveMap.geojsonMouseover(County)",
        inject(["$rootScope",function ($rootScope) {
        controller("mfl.gis.controllers.gis");
        var county = {
            type : "",
            id: "",
            geometry : {},
            properties : {}
        };
        $rootScope.$broadcast("leafletDirectiveMap.geojsonMouseover");
        scope.hoveredCounty = {
            type : "",
            id: "",
            geometry : {},
            properties : {}
        };
        expect(scope.hoveredCounty).toEqual(county);
    }]));
    it("should expect broadcast of leafletDirectiveMap.geojsonMouseover(Const)",
        inject(["$rootScope",function ($rootScope) {
        controller("mfl.gis.controllers.gis_county");
        var constituency = {
            type : "",
            id: "",
            geometry : {},
            properties : {}
        };
        $rootScope.$broadcast("leafletDirectiveMap.geojsonMouseover");
        scope.hoveredConst = {
            type : "",
            id: "",
            geometry : {},
            properties : {}
        };
        expect(scope.hoveredConst).toEqual(constituency);
    }]));
    it("should expect broadcast of leafletDirectiveMap.geojsonMouseover(Ward)",
        inject(["$rootScope",function ($rootScope) {
        controller("mfl.gis.controllers.gis_const");
        var ward = {
            type : "",
            id: "",
            geometry : {},
            properties : {}
        };
        $rootScope.$broadcast("leafletDirectiveMap.geojsonMouseover");
        scope.hoveredWard = {
            type : "",
            id: "",
            geometry : {},
            properties : {}
        };
        expect(scope.hoveredWard).toEqual(ward);
    }]));
    it("should expect broadcast of leafletDirectiveMap.geojsonClick(County)",
       inject(["$state",function ($state) {
        spyOn(scope, "$on").andCallThrough();
        spyOn($state, "go");
        controller("mfl.gis.controllers.gis");
        var county = {
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
        };
        var second_call = scope.$on.calls[1];
        expect(second_call.args[0]).toEqual("leafletDirectiveMap.geojsonClick");
        expect(angular.isFunction(second_call.args[1])).toBe(true);
        var listener = second_call.args[1];
        listener(null, county);
        expect($state.go).toHaveBeenCalledWith("gis_county",{county_id: "",
                                               const_boundaries: "a,b",c:"13:12:8"});
    }]));
    it("should expect broadcast of leafletDirectiveMap.geojsonClick(Const)",
       inject(["$state",function ($state) {
        spyOn(scope, "$on").andCallThrough();
        spyOn($state, "go");
        controller("mfl.gis.controllers.gis_county");
        var constituency = {
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
        };
        var second_call = scope.$on.calls[1];
        expect(second_call.args[0]).toEqual("leafletDirectiveMap.geojsonClick");
        expect(angular.isFunction(second_call.args[1])).toBe(true);
        var listener = second_call.args[1];
        listener(null, constituency);
        expect($state.go).toHaveBeenCalledWith("gis_const",{const_id: "",
                                               ward_boundaries: "a,b",c:"13:12:9"});
    }]));
    it("should expect broadcast of leafletDirectiveMap.geojsonClick(Ward)",
       inject(["$state",function ($state) {
        spyOn(scope, "$on").andCallThrough();
        spyOn($state, "go");
        controller("mfl.gis.controllers.gis_const");
        var ward = {
            type : "",
            id: "",
            geometry : {},
            properties : {
                center:{
                    coordinates : [
                        "12",
                        "13"
                    ]
                }
            }
        };
        var second_call = scope.$on.calls[1];
        expect(second_call.args[0]).toEqual("leafletDirectiveMap.geojsonClick");
        expect(angular.isFunction(second_call.args[1])).toBe(true);
        var listener = second_call.args[1];
        listener(null, ward);
        expect($state.go).toHaveBeenCalledWith("gis_ward",{ward_id: "",c:"13:12:10"});
    }]));

    it("should define centerUrl parameters given $stateParams (County)", inject(["$stateParams",
        function ($stateParams){
        controller("mfl.gis.controllers.gis_county");
        var split_coords = $stateParams.c.split(":");
        expect(parseFloat(split_coords[0], 10)).toBe(13);
        expect(parseFloat(split_coords[1], 10)).toBe(12);
        expect(parseFloat(split_coords[2], 10)).toBe(8);
    }]));
    it("should define centerUrl parameters given $stateParams(Constituency)",
        inject(["$stateParams",
        function ($stateParams){
        controller("mfl.gis.controllers.gis_const");
        var split_coords = $stateParams.c.split(":");
        expect(parseFloat(split_coords[0], 10)).toBe(13);
        expect(parseFloat(split_coords[1], 10)).toBe(12);
        expect(parseFloat(split_coords[2], 10)).toBe(8);
    }]));
    it("should define centerUrl parameters given $stateParams(Ward)", inject(["$stateParams",
        function ($stateParams){
        controller("mfl.gis.controllers.gis_ward");
        var split_coords = $stateParams.c.split(":");
        expect(parseFloat(split_coords[0], 10)).toBe(13);
        expect(parseFloat(split_coords[1], 10)).toBe(12);
        expect(parseFloat(split_coords[2], 10)).toBe(8);
    }]));

    it("should default to scope defined center when no centerUrl is defined(County)",
       inject(["$stateParams",
        function ($stateParams){
        var county = {
            lat : 0.53,
            lng: 37.858,
            zoom: 6
        };
        $stateParams.c = undefined;
        controller("mfl.gis.controllers.gis_county");
        expect($stateParams.c).toBe(undefined);
        expect(scope.county.lat).toBe(county.lat);
        expect(scope.county.lng).toBe(county.lng);
        expect(scope.county.zoom).toBe(county.zoom);
    }]));
    it("should default to scope defined center when no centerUrl is defined(Const)",
       inject(["$stateParams",
        function ($stateParams){
        var constituency = {
            lat : 0.53,
            lng: 37.858,
            zoom: 6
        };
        $stateParams.c = undefined;
        controller("mfl.gis.controllers.gis_const");
        expect($stateParams.c).toBe(undefined);
        expect(scope.constituency.lat).toBe(constituency.lat);
        expect(scope.constituency.lng).toBe(constituency.lng);
        expect(scope.constituency.zoom).toBe(constituency.zoom);
    }]));
    it("should default to scope defined center when no centerUrl is defined(Ward)",
       inject(["$stateParams",
        function ($stateParams){
        var ward = {
            lat : 0.53,
            lng: 37.858,
            zoom: 6
        };
        $stateParams.c = undefined;
        controller("mfl.gis.controllers.gis_ward");
        expect($stateParams.c).toBe(undefined);
        expect(scope.ward.lat).toBe(ward.lat);
        expect(scope.ward.lng).toBe(ward.lng);
        expect(scope.ward.zoom).toBe(ward.zoom);
    }]));
});