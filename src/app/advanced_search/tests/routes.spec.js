
(function(){
    "use strict";
    describe("Filtering: routes", function(){
        var $state, serverUrl, httpBackend;
        beforeEach(function(){
            module("mfl.filtering");
            module("mflAppConfig");
            module("templates-app");
            module("templates-common");
        });
        beforeEach(function(){
            inject(["$state","$httpBackend", "SERVER_URL",
             function(_$state, $httpBackend, SERVER_URL){
                $state = _$state;
                serverUrl = SERVER_URL;
                httpBackend = $httpBackend;
            }]);
        });



        it("should go to filtering page", function(){

            httpBackend.expectGET(serverUrl+"api/common/filtering_summaries/")
                .respond(200, {});
            $state.go("filtering");
            expect($state.href("filtering")).toEqual("#/filtering");
            httpBackend.flush();
        });
    });
})();
