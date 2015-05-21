(function () {
    "use strict";
    describe("Test ratings service: ", function () {
        var localStorage, backend;
        beforeEach(function () {
            module("mflAppConfig");
            module("mfl.rating");
            module("mfl.rating.services");
            localStorage = {
                getItem : null
            };
        });
        beforeEach(inject(["$window","mfl.rating.services.rating",
            function($window, ls) {
                backend = ls;
                $window = $window;
            }
        ]));
        it("should get a rating",
        inject(["$window",function ($window) {
            var service_id = "123";
            backend.getRating(service_id);
            var key_value = $window.localStorage.getItem(service_id);
            expect(key_value).toBe(null);
        }]));
    });
})();
