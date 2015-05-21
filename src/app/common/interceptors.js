(function (angular) {
    "use strict";

    angular.module("mfl.gis.interceptor", [])

    .factory("mfl.gis.interceptor.headers", [function () {
        var cache_headers = {};

        var request_fxn = function(config) {
            var headers = cache_headers[config.url];
            if (_.isUndefined(headers)) {
                return config;
            }

            if (headers.etag_header) {
                config.headers["If-None-Match"] = headers.etag_header;
            }
            if (headers.last_modified_header) {
                config.headers["If-Modified-Since"] = headers.last_modified_header;
            }
            return config;
        };

        var response_fxn = function(response) {
            var etag = response.headers("ETag");
            var last_modified = response.headers("Last-Modified");
            var headers = {};
            if (etag) {
                headers.etag_header = etag;
            }
            if (last_modified) {
                headers.last_modified_header = last_modified;
            }
            cache_headers[response.config.url] = headers;
            return response;
        };

        return {
            "request" : request_fxn,
            "response": response_fxn
        };
    }]);

})(angular);
