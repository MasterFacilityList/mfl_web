(function () {
    "use strict";

    describe("Test rating states", function () {
        var testAuthed, testUnAuthed;

        beforeEach(function () {
            module("mfl.rating");
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

        it("should load rating state (authed)", function () {
            testAuthed("rating");
        });

        it("should load rating state (unauthed)", function () {
            testUnAuthed("rating");
        });

        it("should load rating services state (authed)", function () {
            testAuthed("rating.services");
        });

        it("should load rating services state (unauthed)", function () {
            testUnAuthed("rating.services");
        });

        it("should load rating units state (authed)", function () {
            testAuthed("rating.units");
        });

        it("should load rating units state (unauthed)", function () {
            testUnAuthed("rating.units");
        });
    });

})();
