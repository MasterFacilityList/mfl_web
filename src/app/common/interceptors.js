(function (angular) {
    "use strict";

    angular.module("mfl.common.interceptors", [])

    .factory("mfl.common.interceptors.headers", [function () {
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
    }])

    .factory("mfl.common.interceptors.auth",
        ["$window", "$timeout", "$interval", "$rootScope", "$q",
        function ($window, $timeout, $interval, $rootScope, $q) {
            return {
                "response": function (response) {
                    $window.localStorage.removeItem("auth.reload");
                    return response;
                },
                "responseError": function (rejection) {
                    if (rejection.status === 401 || rejection.status === 403 ||
                        rejection.status === 0) {
                        var timeout = parseInt($window.localStorage.getItem("auth.reload"), 10);
                        if (_.isNaN(timeout)) {
                            timeout = 1000;
                        }
                        $rootScope.reload_timeout = timeout;
                        $timeout(function () {
                            timeout *= 5;
                            $window.localStorage.removeItem("auth.token");
                            $window.localStorage.setItem("auth.reload", timeout);
                            $window.location.reload();
                        }, timeout);
                        $interval(function () {
                            $rootScope.reload_timeout = timeout/1000;
                        }, 1000);
                    }
                    return $q.reject(rejection);
                }
            };
        }
    ]);

})(angular);
