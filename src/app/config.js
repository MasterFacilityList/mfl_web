"use strict";
angular.module("mflApp")
    .config(["$httpProvider", function ($httpProvider) {
            $httpProvider.defaults.withCredentials = false;
            $httpProvider.defaults.headers.common = {
                "Content-Type": "application/json",
                "Accept": "application/json, */*"
            };
        }])

    .run(["$http", "$cookies", 
        function ($http, $cookies) {
            // apparently the angular doesn't do CSRF headers using
            // CORS across different domains thereby this hack
            var csrftoken = $cookies.csrftoken;
            var header_name = "X-CSRFToken";
            $http.defaults.headers.common[header_name] = csrftoken;
            $.ajaxSetup({
                xhrFields: {
                    withCredentials: true
                }
            });
        }]);