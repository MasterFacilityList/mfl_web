(function (angular, _, jQuery, moment) {
    "use strict";

    angular.module("mfl.auth", [])

    .service("api.auth",
        ["$window", "$http", "CREDZ",
        function ($window, $http, credentials) {
            var store_key = "auth.token";
            var storage = $window.localStorage;
            var token_timeout = 10 * 10000; // 10 seconds

            var storeToken = function (token) {
                var auth_token = token.token_type + " " + token.access_token;
                $http.defaults.headers.common.Authorization = auth_token;
                jQuery.ajaxSetup({
                    headers: {
                        Authorization: auth_token
                    }
                });
                var till = moment().add(token.expires_in, "seconds");
                token.expire_at = till;
                storage.setItem(store_key, JSON.stringify(token));
                // refresh token before it expires
                $timeout(function () {
                    refreshToken(token);
                }, (parseInt(token.expires_in, 10) * 1000) - token_timeout);
            };

            var refreshToken = function (token) {
                var payload = {
                    "grant": "refresh_token",
                    "refresh_token": token.refresh_token,
                    "client_id": credentials.client_id,
                    "client_secret": credentials.client_secret
                };
                return $http({
                    url: credentials.token_url,
                    data: payload,
                    method: "POST"
                }).success(storeToken);
            };

            this.fetchToken = function () {
                var payload = {
                    "grant": "password",
                    "username": credentials.username,
                    "password": credentials.password,
                    "client_id": credentials.client_id,
                    "client_secret": credentials.client_secret
                };

                return $http({
                    url:  credentials.token_url,
                    data: payload,
                    method: "POST"
                }).success(storeToken);
            };

            this.getToken = function () {
                var token = JSON.parse(storage.getItem(store_key));
                if (! _.isNull(token)) {
                    if (moment(token.expire_at) > moment().add(token_timeout, "ms")) {
                        return token;
                    }
                }

                return null;
            };
        }
    ]);

})(angular, _, jQuery, moment);
