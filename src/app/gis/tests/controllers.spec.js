(function () {
    "use strict";

    describe("Tests for GIS controllers:", function () {
        var controller, scope, root, data, state, httpBackend, SERVER_URL;

        beforeEach(function () {
            module("ui.router");
            module("mflAppConfig");
            module("mfl.gis.controllers");
            module("mfl.gis.wrapper");
            module("mfl.adminunits.wrapper");

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
        it("should expect countiesApi & gisCountiesApi to load list",
            inject(["$httpBackend",function ($httpBackend) {
                controller("mfl.gis.controllers.gis");
                var data = "";
                $httpBackend.expectGET(SERVER_URL + "api/common/counties/")
                    .respond(200, data);
                $httpBackend.expectGET(
                    SERVER_URL + "api/gis/county_boundaries/?format=json&page_size=47")
                    .respond(200, data);
                $httpBackend.flush();
            }]));
    });
})();
