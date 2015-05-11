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

    it("should expect gisCountiesApi & gisConstsApi to load list",
            inject(["$httpBackend",function ($httpBackend) {
        controller("mfl.gis.controllers.gis_county");
        var data = "";
        $httpBackend.expectGET(
        SERVER_URL + "api/gis/constituency_boundaries/?id=4,1.3,2,41&format=json")
            .respond(200, data);
        $httpBackend.flush();
    }]));
    it("should expect define behavior for $stateParams.c if undefined",
            function () {
            
    });
});