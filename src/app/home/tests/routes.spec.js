(function () {
    "use strict";

    describe("Tests for home routes: ", function() {

        var $state;

        beforeEach(function() {
            module("mfl.home.routes");

            inject(["$state", function (s) {
                $state = s;
            }]);
        });

        it("should go to home url", function () {
            expect($state.href("home")).toEqual("#/home");
        });
    });

})();
