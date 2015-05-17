(function (angular, jQuery, moment) {
    "use strict";

    describe("Test mfl.auth service :", function () {
        var access_token, refresh_token, store_key;

        beforeEach(function () {
            access_token = {
                "access_token": "pcQyIBpcsklNuZlAflBruEmREvpl8a",
                "token_type": "Bearer",
                "expires_in": 36000,
                "refresh_token": "jwBcSt8ms4kJEtcF8Bl6jjrqG7YQb8",
                "scope": "read write"
            };
            refresh_token = {
                "access_token": "typo",
                "token_type": "Bearer",
                "expires_in": 36000,
                "refresh_token": "pypo",
                "scope": "read write"
            };
            store_key = "auth.token";
        });

        describe("Test api.auth.service", function () {
            beforeEach(module("mfl.auth.service", "mflAppConfig"));

            it("should store get token from storage", function () {
                inject(["$window", "api.auth", function ($window, auth) {
                    access_token.expire_at = moment().add(1, "year");
                    $window.localStorage.setItem(store_key, JSON.stringify(access_token));
                    var token = auth.getToken();
                    expect(token.expires_in).toEqual(access_token.expires_in);
                    expect(token.scope).toEqual(access_token.scope);
                    expect(token.access_token).toEqual(access_token.access_token);
                    expect(token.refresh_token).toEqual(access_token.refresh_token);
                }]);
            });

            it("should return null if store is empty", function () {
                inject(["$window", "api.auth", function ($window, auth) {
                    $window.localStorage.removeItem(store_key);
                    var token = auth.getToken();
                    expect(token).toBe(null);
                }]);
            });

            it("should remove expired token from storage", function () {
                inject(["$window", "api.auth", function ($window, auth) {
                    access_token.expire_at = moment().subtract(1, "year");
                    $window.localStorage.setItem(store_key, JSON.stringify(access_token));
                    var token = auth.getToken();
                    expect(token).toBe(null);
                    expect($window.localStorage.getItem(store_key)).toBe(null);
                }]);
            });

            it("should fetch a token from oauth2 provider and store it", function () {
                inject(["$window", "$httpBackend", "CREDZ", "api.auth",
                    function ($window, $httpBackend, credz, auth) {
                        var payload =
                            "grant_type=" + "password" +
                            "&username=" + credz.username +
                            "&password=" + credz.password +
                            "&client_id=" + credz.client_id +
                            "&client_secret=" + credz.client_secret;
                        $httpBackend
                            .expectPOST(credz.token_url, payload)
                            .respond(200, access_token);

                        auth.fetchToken();
                        $httpBackend.flush();
                        $httpBackend.verifyNoOutstandingExpectation();
                        $httpBackend.verifyNoOutstandingRequest();

                        var token = JSON.parse($window.localStorage.getItem(store_key));
                        expect(token.expires_in).toEqual(access_token.expires_in);
                        expect(token.scope).toEqual(access_token.scope);
                        expect(token.access_token).toEqual(access_token.access_token);
                        expect(token.refresh_token).toEqual(access_token.refresh_token);
                        expect(moment(token.expire_at)).toBeGreaterThan(moment());
                    }
                ]);
            });

            it("should allow another token request on failure", function () {
                inject(["$window", "$httpBackend", "CREDZ", "api.auth",
                    function ($window, $httpBackend, credz, auth) {
                        var payload =
                            "grant_type=" + "password" +
                            "&username=" + credz.username +
                            "&password=" + credz.password +
                            "&client_id=" + credz.client_id +
                            "&client_secret=" + credz.client_secret;
                        $httpBackend
                            .expectPOST(credz.token_url, payload)
                            .respond(500);

                        var rq1 = auth.fetchToken();
                        $httpBackend.flush();
                        $httpBackend.verifyNoOutstandingExpectation();
                        $httpBackend.verifyNoOutstandingRequest();

                        var rq2 = auth.fetchToken();
                        expect(rq1).not.toEqual(rq2);
                    }
                ]);
            });

            it("should not issue multiple unresolved requests to fetch a token", function () {
                inject(["api.auth", function (auth) {
                    var rq = auth.fetchToken();

                    var rq2 = auth.fetchToken();
                    expect(rq).toEqual(rq2);

                    var rq3 = auth.refreshToken(access_token);
                    expect(rq).toEqual(rq3);
                }]);
            });

            it("should refresh a token from oauth2 provider and store new token", function () {
                inject(["$window", "$httpBackend", "CREDZ", "api.auth",
                    function ($window, $httpBackend, credz, auth) {
                        window.localStorage.setItem(store_key, JSON.stringify(access_token));

                        var payload =
                            "grant_type=" + "refresh_token" +
                            "&refresh_token=" + access_token.refresh_token +
                            "&client_id=" + credz.client_id +
                            "&client_secret=" + credz.client_secret;

                        $httpBackend
                            .expectPOST(credz.token_url, payload)
                            .respond(200, refresh_token);

                        auth.refreshToken(access_token);

                        $httpBackend.flush();
                        $httpBackend.verifyNoOutstandingExpectation();
                        $httpBackend.verifyNoOutstandingRequest();

                        var token = JSON.parse($window.localStorage.getItem(store_key));
                        expect(token.expires_in).toEqual(refresh_token.expires_in);
                        expect(token.scope).toEqual(refresh_token.scope);
                        expect(token.access_token).toEqual(refresh_token.access_token);
                        expect(token.refresh_token).toEqual(refresh_token.refresh_token);
                        expect(moment(token.expire_at)).toBeGreaterThan(moment());
                    }
                ]);
            });

            it("should set XHR authorization headers after fetching a token", function () {
                inject(["$window", "$httpBackend", "$http", "CREDZ", "api.auth",
                    function ($window, $httpBackend, $http, credz, auth) {
                        var payload =
                            "grant_type=" + "password" +
                            "&username=" + credz.username +
                            "&password=" + credz.password +
                            "&client_id=" + credz.client_id +
                            "&client_secret=" + credz.client_secret;
                        $httpBackend
                            .expectPOST(credz.token_url, payload)
                            .respond(200, access_token);

                        auth.fetchToken();
                        $httpBackend.flush();
                        $httpBackend.verifyNoOutstandingExpectation();
                        $httpBackend.verifyNoOutstandingRequest();

                        var token = JSON.parse($window.localStorage.getItem(store_key));
                        var header_value = token.token_type + " " + token.access_token;

                        expect($http.defaults.headers.common.Authorization).toEqual(header_value);
                        expect(jQuery.ajaxSettings.headers.Authorization).toEqual(header_value);
                    }
                ]);
            });

            it("should set a token refresh timeout", function () {
                inject(["$window", "$httpBackend", "$timeout", "CREDZ", "api.auth",
                    function ($window, $httpBackend, $timeout, credz, auth) {
                        var payload =
                            "grant_type=" + "password" +
                            "&username=" + credz.username +
                            "&password=" + credz.password +
                            "&client_id=" + credz.client_id +
                            "&client_secret=" + credz.client_secret;
                        $httpBackend
                            .expectPOST(credz.token_url, payload)
                            .respond(200, access_token);

                        auth.fetchToken();
                        $httpBackend.flush();
                        $httpBackend.verifyNoOutstandingExpectation();
                        $httpBackend.verifyNoOutstandingRequest();

                        $httpBackend.resetExpectations();

                        payload =
                            "grant_type=" + "refresh_token" +
                            "&refresh_token=" + access_token.refresh_token +
                            "&client_id=" + credz.client_id +
                            "&client_secret=" + credz.client_secret;

                        $httpBackend
                            .expectPOST(credz.token_url, payload)
                            .respond(200, refresh_token);

                        $timeout.flush();

                        $httpBackend.flush();
                        $httpBackend.verifyNoOutstandingExpectation();
                        $httpBackend.verifyNoOutstandingRequest();
                    }
                ]);
            });
        });

        describe("Test mfl.auth.config run configuration", function () {
            var run_fxn, auth_service;

            beforeEach(function () {
                run_fxn = angular.module("mfl.auth.config")._runBlocks[0][1];

                auth_service = {
                    fetchToken: angular.noop,
                    setXHRToken: angular.noop,
                    getToken: angular.noop
                };
            });

            it("should fetch auth token if getToken is null", function () {
                spyOn(auth_service, "getToken").andReturn(null);
                spyOn(auth_service, "fetchToken");
                spyOn(auth_service, "setXHRToken");

                run_fxn(auth_service);

                expect(auth_service.getToken).toHaveBeenCalled();
                expect(auth_service.fetchToken).toHaveBeenCalled();
                expect(auth_service.setXHRToken).not.toHaveBeenCalled();
            });

            it("should set auth token if getToken is not null", function () {
                spyOn(auth_service, "getToken").andReturn(access_token);
                spyOn(auth_service, "fetchToken");
                spyOn(auth_service, "setXHRToken");

                run_fxn(auth_service);

                expect(auth_service.getToken).toHaveBeenCalled();
                expect(auth_service.fetchToken).not.toHaveBeenCalled();
                expect(auth_service.setXHRToken).toHaveBeenCalledWith(access_token);
            });

        });

    });
})(angular, jQuery, moment);
