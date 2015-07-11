(function () {
    "use strict";

    describe("Tests for home routes: ", function() {
        var testAuthed, testUnAuthed;

        beforeEach(function () {
            module("mfl.home");
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

        it("should load home state (authed)", function () {
            testAuthed("home");
        });

        it("should load home state (unauthed)", function () {
            testUnAuthed("home");
        });
    });

})();
