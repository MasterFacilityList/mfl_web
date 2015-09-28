(function () {
    "use strict";

    describe("Test filter states", function () {
        var testAuthed, testUnAuthed;

        beforeEach(function () {
            module("mfl.downloads");
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

        it("should load downloads state (authed)", function () {
            testAuthed("downloads");
        });

        it("should load downloads filter state (unauthed)", function () {
            testUnAuthed("downloads");
        });
    });

})();
