(function () {
    "use strict";

    describe("test gis interceptor", function () {
        var url1, url2, config, response, etag, last_modified;

        beforeEach(function () {
            module("mfl.common.interceptors");
            url1 = "http://test.com/?all=true";
            url2 = "http://test.com/?all=false";
            etag = "etag";
            last_modified = "last_modified";

            config = {
                "url": url1,
                "headers": {}
            };
            response = {
                "config": config,
                headers: function (a) {
                    switch (a) {
                    case "ETag":
                        return etag;
                    case "Last-Modified":
                        return last_modified;
                    }
                }
            };
        });

        it("should get caching headers from a response", function () {
            inject(["mfl.common.interceptors.headers", function (i) {
                i.response(response);
                i.request(config);
                expect(config.headers["If-None-Match"]).toEqual(etag);
                expect(config.headers["If-Modified-Since"]).toEqual(last_modified);
            }]);
        });

        it("should not not use caching headers for the wrong url", function () {
            inject(["mfl.common.interceptors.headers", function (i) {
                i.response(response);
                config.url = url2;
                i.request(config);
                expect(config.headers["If-Modified-Since"]).toBe(undefined);
                expect(config.headers["If-None-Match"]).toBe(undefined);
            }]);
        });
    });

    describe("test auth interceptor", function () {
        var wndw;

        beforeEach(module("mfl.common.interceptors"));

        beforeEach(function () {
            wndw = {
                localStorage: {
                    removeItem: jasmine.createSpy()
                },
                location: {
                    reload: jasmine.createSpy()
                }
            };
            module(function ($provide) {
                $provide.value("$window", wndw);
            });
        });

        it("should not care about other response errors", function () {
            inject(["$injector", function (inj) {
                var interceptor = inj.get("mfl.auth.interceptor");
                var rejection = {status: 404};
                expect(interceptor.responseError(rejection)).toBe(rejection);
                expect(wndw.location.reload).not.toHaveBeenCalled();
                expect(wndw.localStorage.removeItem).not.toHaveBeenCalled();
            }]);
        });

        it("should take action on 401 or 403", function () {
            inject(["mfl.auth.interceptor", function (i) {
                [401, 403].forEach(function (code) {
                    var rejection = {status: code};
                    expect(i.responseError(rejection)).toBe(rejection);
                    expect(wndw.location.reload).toHaveBeenCalled();
                    expect(wndw.localStorage.removeItem).toHaveBeenCalled();
                });
            }]);
        });
    });

})();
