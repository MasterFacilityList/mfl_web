(function () {
    "use strict";

    describe("Test gis interceptor", function () {
        var url1, url2, config, response, etag, last_modified;

        beforeEach(function () {
            module("mfl.gis.interceptor");
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
            inject(["mfl.gis.interceptor.headers", function (i) {
                i.response(response);
                i.request(config);
                expect(config.headers["If-None-Match"]).toEqual(etag);
                expect(config.headers["If-Modified-Since"]).toEqual(last_modified);
            }]);
        });

        it("should not not use caching headers for the wrong url", function () {
            inject(["mfl.gis.interceptor.headers", function (i) {
                i.response(response);
                config.url = url2;
                i.request(config);
                expect(config.headers["If-Modified-Since"]).toBe(undefined);
                expect(config.headers["If-None-Match"]).toBe(undefined);
            }]);
        });

    });
})();
