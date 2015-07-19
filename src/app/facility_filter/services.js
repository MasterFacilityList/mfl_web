(function(angular){
    "use strict";

    angular.module("mfl.facility_filter.services", [
        "api.wrapper",
        "mfl.auth.service"
    ])

    .service("mfl.facility_filter.services.wrappers",
        ["api", function(api) {
            this.filters = api.setBaseUrl("api/common/filtering_summaries/");
            this.facilities = api.setBaseUrl("api/facilities/facilities_list/");
            this.helpers = api.apiHelpers;
        }]
    );

})(window.angular);
