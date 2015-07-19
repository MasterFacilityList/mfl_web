(function (angular) {

    "use strict";

    angular.module("mfl.facilities.wrapper", [
        "api.wrapper", "mflAppConfig"
    ])

    .service("facilitiesApi", ["api", function (api) {
        this.facilities = api.setBaseUrl("api/facilities/facilities");
        this.services = api.setBaseUrl("api/facilities/services");
        this.ratings = api.setBaseUrl("api/facilities/facility_service_ratings/");
        this.chus = api.setBaseUrl("api/chul/units");
    }])

    .service("searchService",["SERVER_URL", "mfl.typeahead",
        function (SERVER_URL, typeahead) {
            var facilities_url = "api/facilities/facilities/?fields=name&search=%QUERY";
            var initFacilities = function () {
                return typeahead.initTT(
                    "facilities",
                    "name",
                    SERVER_URL+facilities_url,
                    15
                );
            };
            this.typeaheadFacilities = function (fieldclass) {
                var f = initFacilities();
                var name = fieldclass || "facilities";
                typeahead.typeaheadUI(name, {
                    displayKey: "name",
                    source: f.ttAdapter()
                });
            };
        }
    ]);
})(window.angular);
