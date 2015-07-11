(function () {
    "use strict";

    describe("Test filter states", function () {
        var testAuthed, testUnAuthed;

        beforeEach(function () {
            module("mfl.facility_filter");
            module("mflAppConfig");
            module("templates-app");
            module("mfl.auth.service");

            inject(["$rootScope", "$state", "api.auth",
                function ($rootScope, $state, auth) {
                    testAuthed = function (name) {
                        spyOn(auth, "getToken").andReturn({access_token: "DSA"});
                        spyOn(auth, "fetchToken");
                        $state.go(name);
                        $rootScope.$digest();
                        expect($state.current.name).toEqual(name);
                        expect(auth.fetchToken).not.toHaveBeenCalled();
                    };
                    testUnAuthed = function (name) {
                        spyOn(auth, "getToken").andReturn(null);
                        spyOn(auth, "fetchToken");
                        $state.go(name);
                        $rootScope.$digest();
                        expect($state.current.name).toEqual(name);
                        expect(auth.fetchToken).toHaveBeenCalled();
                    };
                }]
            );
        });

        it("should load filter state (authed)", function () {
            testAuthed("facility_filter");
        });

        it("should load filter state (unauthed)", function () {
            testUnAuthed("facility_filter");
        });

        it("should load results state (authed)", function () {
            testAuthed("facility_filter.results");
        });

        it("should load results state (unauthed)", function () {
            testUnAuthed("facility_filter.results");
        });
    });

})();
