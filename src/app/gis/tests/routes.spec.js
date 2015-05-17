(function () {
    "use strict";

    describe("Tests for gis routes: ", function() {

        var $state;

        beforeEach(function() {
            module("mfl.gis.routes");

            inject(["$state", function (s) {
                $state = s;
            }]);
        });

        it("should go to country url", function () {
            expect($state.href("gis")).toEqual("#/gis");
        });

        it("should go to county url", function () {
            expect($state.href("gis_county", {county_id: 2})).toEqual("#/county/2");
        });

        it("should go to constituency url", function () {
            expect($state.href("gis_constituency", {constituency_id: 2}))
            .toEqual("#/constituency/2");
        });

        it("should go to ward url", function () {
            expect($state.href("gis_ward", {ward_id: 2})).toEqual("#/ward/2");
        });
    });

})();
