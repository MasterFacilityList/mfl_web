"use strict";

describe("Tests for GIS controllers:", function () {
    var controller, scope, root, data, state, httpBackend, SERVER_URL;

    beforeEach(function () {
        module("mflwebApp");
        module("mfl.gis.controllers");
        module("mfl.gis.wrapper");
        module("mfl.adminunits.wrapper");
        module("mfl.gis.interceptors");

        inject(["$rootScope", "$controller","$httpBackend","$state",
                "SERVER_URL","countiesApi",
            function ($rootScope, $controller, $httpBackend, $state,
                  url, countiesApi) {
                root = $rootScope;
                scope = root.$new();
                state = $state;
                httpBackend = $httpBackend;
                SERVER_URL = url;
                countiesApi = countiesApi;
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
    it("should expect countiesApi to load list", inject(["$httpBackend",function ($httpBackend) {
        controller("mfl.gis.controllers.gis");
        var counties = "";
        $httpBackend.expectGET(
        SERVER_URL + "api/common/counties/?format=json&page_size=50")
            .respond(200, counties);
        expect(scope.counties).toBe(counties);
    }]));
});