(function (angular, jQuery, _) {
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
                    jQuery("#conn_error").addClass("hidden");  // this is illegal
                    return response;
                },
                "responseError": function (rejection) {
                    if (rejection.status === 401 || rejection.status === 403 ||
                        rejection.status === 0) {
                        var timeout = parseInt($window.localStorage.getItem("auth.reload"), 10);
                        if (_.isNaN(timeout)) {
                            timeout = 1000;
                        }
                        $rootScope.reload_timeout = timeout/1000;
                        $timeout(function () {
                            timeout *= 5;
                            $window.localStorage.removeItem("auth.token");
                            $window.localStorage.setItem("auth.reload", timeout);
                            $window.location.reload();
                        }, timeout);
                        $interval(function (a) {
                            $rootScope.reload_timeout = (timeout/1000) - a;
                        }, 1000);
                        jQuery("#conn_error").removeClass("hidden");  // this is illegal
                    }
                    return $q.reject(rejection);
                }
            };
        }
    ])

    .service("mfl.common.state.resolve.throttle", ["$rootScope", function ($rootScope) {
        var retries = 0;
        var MAX_RETRIES = 3;

        var evt_listener = function (evt, toState, toParams, fromState, fromParams, err) {
            if (angular.isObject(err) && angular.isDefined(err.status)) {  // it is a http error
                if (retries < MAX_RETRIES) {
                    retries++;
                } else {
                    evt.preventDefault();
                    retries = 0;
                }
            }
        };

        var startListening = function () {
            $rootScope.$on("$stateChangeError", evt_listener);
        };

        return {
            "startListening": startListening
        };
    }])

    .run(["mfl.common.state.resolve.throttle", function (stateThrottle) {
        stateThrottle.startListening();
    }]);

})(window.angular, window.jQuery, window._);
