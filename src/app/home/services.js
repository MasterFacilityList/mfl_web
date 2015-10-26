(function (angular, jQuery) {

    "use strict";

    angular.module("mfl.facilities.wrapper", [
        "api.wrapper", "mflAppConfig"
    ])

    .service("facilitiesApi", ["api", function (api) {
        this.facilities = api.setBaseUrl("api/facilities/facilities");
        this.services = api.setBaseUrl("api/facilities/services");
        this.ratings = api.setBaseUrl("api/facilities/facility_service_ratings/");
        this.chus = api.setBaseUrl("api/chul/units");
        this.documents = api.setBaseUrl("api/common/documents/");
        this.chul_services = api.setBaseUrl("api/chul/services/");
        this.helpers = api.apiHelpers;
        this.facility_pdf = api.setBaseUrl("api/facilities/facility_detail_report/");
    }])

    .service("searchService",["SERVER_URL", "mfl.typeahead",
        function (SERVER_URL, typeahead) {
            var facilities_url = "api/facilities/facilities/?fields=name&search=%QUERY";
            var chus_url = "api/chul/units/?fields=name&search=%QUERY";

            var initTT = function (url_stub, fieldclass, recreate) {
                var f = typeahead.initTT(
                    "facilities", "name", SERVER_URL+url_stub, 15, recreate
                );
                var name = fieldclass || "facilities";
                typeahead.typeaheadUI(name, {
                    displayKey: "name",
                    source: f.ttAdapter()
                });
            };

            this.destroyTT = function (fieldclass) {
                // yeah...this is criminal
                return jQuery(fieldclass).typeahead("destroy");
            };

            this.typeaheadFacilities = function (fieldclass) {
                initTT(facilities_url, fieldclass, true);
            };

            this.typeaheadCHUs = function (fieldclass) {
                initTT(chus_url, fieldclass, true);
            };
        }
    ]);

})(window.angular, window.jQuery);
