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
                    removeItem: jasmine.createSpy(),
                    getItem: jasmine.createSpy(),
                    setItem: jasmine.createSpy()
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
                var interceptor = inj.get("mfl.common.interceptors.auth");
                var rejection = {status: 404};
                expect(interceptor.responseError(rejection).$$state.value).toBe(rejection);
                expect(wndw.location.reload).not.toHaveBeenCalled();
                expect(wndw.localStorage.removeItem).not.toHaveBeenCalled();
            }]);
        });

        it("should take action on 401 or 403", function () {
            inject(["mfl.common.interceptors.auth", "$timeout", "$interval", function (i, to, iv) {
                [401, 403].forEach(function (code) {
                    var rejection = {status: code};
                    expect(i.responseError(rejection).$$state.value).toBe(rejection);
                    iv.flush(1000);
                    to.flush(1000);
                    expect(wndw.location.reload).toHaveBeenCalled();
                    expect(wndw.localStorage.removeItem).toHaveBeenCalled();
                });
            }]);
        });

        it("should use existing timeout", function () {
            wndw.localStorage.getItem.andReturn(5);
            inject(["mfl.common.interceptors.auth", "$timeout", "$interval", function (i, to, iv) {
                [401, 403].forEach(function (code) {
                    var rejection = {status: code};
                    expect(i.responseError(rejection).$$state.value).toBe(rejection);
                    iv.flush(1000);
                    to.flush(1000);
                    expect(wndw.location.reload).toHaveBeenCalled();
                    expect(wndw.localStorage.removeItem).toHaveBeenCalled();
                });
            }]);
        });
    });

    describe("test resolve throttle", function () {
        var rootScope;

        beforeEach(function () {
            module("mfl.common.interceptors");
            inject(["$rootScope", function (rs) {
                rootScope = rs;
            }]);
        });

        it("should throttle http activity", function() {
            spyOn(rootScope, "$on");
            inject(["mfl.common.state.resolve.throttle", function (th) {
                th.startListening();
                expect(rootScope.$on).toHaveBeenCalled();
                var fxn = rootScope.$on.calls[0].args[1];
                var evt = {
                    preventDefault: jasmine.createSpy()
                };
                var err = {status: 0};

                fxn(evt, null, null, null, null, err);
                fxn(evt, null, null, null, null, err);
                fxn(evt, null, null, null, null, err);
                fxn(evt, null, null, null, null, err);
                fxn(evt, null, null, null, null, err);
                fxn(evt, null, null, null, null, err);
                expect(evt.preventDefault.calls.length).toEqual(1);
            }]);
        });

        it("should not care about other activity", function () {
            spyOn(rootScope, "$on");
            inject(["mfl.common.state.resolve.throttle", function (th) {
                th.startListening();
                expect(rootScope.$on).toHaveBeenCalled();
                var fxn = rootScope.$on.calls[0].args[1];
                fxn();
            }]);
        });
    });
})();
