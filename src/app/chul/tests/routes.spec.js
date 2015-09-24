(function () {
    "use strict";

    describe("Test filter states", function () {
        var testAuthed, testUnAuthed;

        beforeEach(function () {
            module("mfl.chul");
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

        it("should load chu list (authed)", function () {
            testAuthed("chul");
        });

        it("should load chu list (unauthed)", function () {
            testUnAuthed("chul");
        });

        it("should load chu view (authed)", function () {
            testAuthed("chul_view");
        });

        it("should load chu view (unauthed)", function () {
            testUnAuthed("chul_view");
        });

    });

})();
