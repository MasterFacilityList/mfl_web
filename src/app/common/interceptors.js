(function (angular) {
    "use strict";

    angular.module("mfl.gis.interceptor", [])

    .factory("mfl.gis.interceptor.headers", [function () {
        var etag_header = null;
        var last_modified_header = null;

        return {
            "request" : function(config) {

                if (etag_header) {
                    config.headers.ETag = etag_header;
                    config.headers["If-None-Match"] = etag_header;
                }
                if (last_modified_header) {
                    config.headers["If-Modified-Since"] = last_modified_header;
                }
                return config;
            },

            "response": function(response) {
                var etag = response.headers("ETag");
                var last_modified = response.headers("Last-Modified");
                if (etag) {
                    etag_header = etag;
                }
                if (last_modified) {
                    last_modified_header = last_modified;
                }
                return response;
            }
        };
    }]);

})(angular);
