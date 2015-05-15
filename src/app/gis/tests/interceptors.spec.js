(function (angular) {
    "use strict";

    describe("Test MFL GIS Interceptors :", function () {
        var rootScope, q, server_url;

        beforeEach(module("mfl.gis.interceptors"));

        beforeEach(function () {
            inject(["$rootScope", "$q","SERVER_URL", function (rs,$q,url) {
                rootScope = rs;
                q = $q;
                server_url = url;
            }]);
        });
        describe("test gis interceptor: ", function () {
            var payload = {
                count: 1,
                previous: null,
                next: null,
                results: [
                    {
                        name: "value"
                    }
                ]
            };

            it("should define functions", function () {
                inject(["mfl.gis.interceptors.gis_boundaries", function (gis) {
                    expect(angular.isFunction(gis.response)).toBeTruthy();
                }]);
            });

            describe("response :", function () {
                it ("should detect all responded requests", function () {
                    inject(["mfl.gis.interceptors.gis_boundaries", function (gis) {
                        var p = gis.response.data;
                        expect(p).toEqual(gis.response.data);
                    }]);
                });

                it ("should transform gis response", function () {
                    inject(["mfl.gis.interceptors.gis_boundaries", function (gis) {
                        var response = {
                            config: {
                                url: server_url + "api/gis/county_boundaries/"
                            },
                            data: payload
                        };
                        var p = gis.response(response);
                        expect(p.data).toEqual(payload.results);
                    }]);
                });

                it ("should not transform non-gis response", function () {
                    inject(["mfl.gis.interceptors.gis_boundaries", function (gis) {
                        var response = {
                            config: {
                                url: server_url + "api/users/"
                            },
                            data: payload
                        };
                        var p = gis.response(response);
                        expect(p.data).toEqual(payload);
                    }]);
                });
            });
        });
    });
})(angular);
