"use strict";
(function(){
    describe("searchService test case", function(){
        var charia, tt;
        beforeEach(function () {
            module("mfl.home");
            module("mflAppConfig");
            module("templates-app");
            module("templates-common");
            module("mfl.common.typeahead");
            inject(["searchService","mfl.typeahead",function(searchService, typeahead){
                charia = searchService;
                tt = typeahead;
            }]);
        });

        it("should have `searchService` defined", function(){
            expect(charia).toBeDefined();
        });

        it("should typeaheadFacilities", function(){
            spyOn(tt, "typeaheadUI");
            charia.typeaheadFacilities();
            expect(tt.typeaheadUI).toHaveBeenCalled();
        });
    });

})();
