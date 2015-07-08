(function(angular){
    "use strict";
    angular.module("mfl.filtering.services", ["sil.api.wrapper"])

    .service("filteringApi", ["api", function(api){
        this.filters = api.setBaseUrl("api/common/filtering_summaries");
        this.facilities = api.setBaseUrl("api/facilities/facilities_list");
        this.constituencies = api.setBaseUrl("api/common/constituencies");
        this.wards = api.setBaseUrl("api/common/wards");
        this.counties = api.setBaseUrl("api/common/counties");
        this.towns = api.setBaseUrl("api/common/towns");
        this.chus = api.setBaseUrl("api/chul/units");
        this.operation_status = api.setBaseUrl("api/facilities/facility_status");
        this.owners = api.setBaseUrl("api/facilities/owners");
        this.officers = api.setBaseUrl("api/facilities/officers");
        this.facility_types = api.setBaseUrl("api/facilities/facility_types");
        this.service_category = api.setBaseUrl("api/facilities/service_categories");
    }]);
})(angular);
