(function(angular){
    "use strict";

    angular.module("mfl.chul.services", [
        "api.wrapper"
    ])

    .service("mfl.chul.services.wrappers",
        ["api", function(api) {
            this.chul = api.setBaseUrl("api/chul/units/");
            this.chul_pdf = api.setBaseUrl("api/chul/units_detail_report/");
            this.chul_ratings = api.setBaseUrl("api/chul/chu_ratings/");
            this.filters = api.setBaseUrl("api/common/filtering_summaries/");
            this.helpers = api.apiHelpers;
        }]
    );

})(window.angular);
