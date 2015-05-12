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
                "SERVER_URL","countiesApi","constsApi",
            function ($rootScope, $controller, $httpBackend, $state,$stateParams,
                  url, countiesApi,constsApi) {
                root = $rootScope;
                scope = root.$new();
                state = $state;
                httpBackend = $httpBackend;
                SERVER_URL = url;
                countiesApi = countiesApi;
                $stateParams.county_id = 4;
                $stateParams.const_boundaries = "4,1.3,2,41";
                $stateParams.ward_boundaries = "4,2,41";
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
    it("should expect broadcast of leafletDirectiveMap.geojsonMouseover",
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
    
    it("should expect broadcast of leafletDirectiveMap.geojsonClick",
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

    it("should define centerUrl parameters given $stateParams", inject(["$stateParams",
        function ($stateParams){
        controller("mfl.gis.controllers.gis_county");
        var split_coords = $stateParams.c.split(":");
        expect(parseFloat(split_coords[0], 10)).toBe(13);
        expect(parseFloat(split_coords[1], 10)).toBe(12);
        expect(parseFloat(split_coords[2], 10)).toBe(8);
    }]));

    it("should default to scope defined center when no centerUrl is defined",
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

    it("should expect gisCountiesApi & gisConstsApi to load data",
            inject(["$httpBackend",function ($httpBackend) {
        controller("mfl.gis.controllers.gis_county");
        var data = "";
        $httpBackend.expectGET(
        SERVER_URL + "api/gis/constituency_boundaries/?id=4,1.3,2,41&format=json")
            .respond(200, data);
        $httpBackend.flush();
    }]));
    it("should expect gisWardsApi to load data",
            inject(["$httpBackend",function ($httpBackend) {
        controller("mfl.gis.controllers.gis_const");
        var data = "";
        $httpBackend.expectGET(
        SERVER_URL + "api/gis/ward_boundaries/?id=4,2,41&format=json")
            .respond(200, data);
        $httpBackend.flush();
    }]));
    it("should expect gisWardsApi to load data",
            inject(["$httpBackend",function ($httpBackend) {
        controller("mfl.gis.controllers.gis_ward");
        var data = "";
        $httpBackend.expectGET(
        SERVER_URL + "api/gis/ward_boundaries/?id=4&format=json")
            .respond(200, data);
        $httpBackend.flush();
    }]));
});