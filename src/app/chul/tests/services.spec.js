"use strict";
(function(){
    describe("searchService test case", function(){

        beforeEach(function () {
            module("mfl.chul");
            module("mfl.chul.services");
        });

        it("should have chul services defined", function(){
            expect("mfl.chul.services.wrappers").toBeDefined();
        });

    });

})();
